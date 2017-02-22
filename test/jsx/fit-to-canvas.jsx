#target photoshop

var docRef = app.activeDocument;
var activeLay = docRef.activeLayer;
var layerNo = activeLay.layers.length;
var defaultRulerUnits = app.preferences.rulerUnits; // store the ruler
app.preferences.rulerUnits = Units.PIXELS; 

function imageDimensions() {
    
    //var len = app.activeDocument.layerSets.getByName("Processing").layers.length; // Count images
    
    for (var i = 0; i < layerNo; i++) {
        var layr = activeLay.layers[i];
        var SWidth  = app.activeDocument.width.as('px');    
        var SHeight = app.activeDocument.height.as('px');    
        var bounds = layr.bounds;    
        var LWidth = bounds[2].as('px')-bounds[0].as('px');    
        var LHeight = bounds[3].as('px')-bounds[1].as('px'); 
        var userResampleMethod = app.preferences.interpolation;  // Save interpolation settings    
        
        if( layr.kind != LayerKind.NORMAL && layr.kind != LayerKind.SMARTOBJECT) return;
        
        app.preferences.interpolation = ResampleMethod.BICUBIC; // resample interpolation bicubic    
        
        if (LWidth/LHeight<SWidth/SHeight) { // Smart Object layer Aspect Ratio less the Canvas area Aspect Ratio     
           var percentageChange = ((SWidth/LWidth)*100);  // Resize to canvas area width    
           layr.resize(percentageChange,percentageChange,AnchorPosition.MIDDLECENTER);    
        }
        
        else {     
          var percentageChange = ((SHeight/LHeight)*100); // resize to canvas area height    
          layr.resize(percentageChange,percentageChange,AnchorPosition.MIDDLECENTER);    
        }
        
        app.preferences.interpolation = userResampleMethod; // Reset interpolation setting   
        
        app.activeDocument.selection.selectAll();  
        align('AdCH'); align('AdCV');  
        app.activeDocument.selection.deselect();  
          
          
        // -----------------------------------------  
        // Align Layers to selection  
        // -----------------------------------------  
        function align(method) {  
            var desc = new ActionDescriptor();  
            var ref = new ActionReference();  
            ref.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );  
            desc.putReference( charIDToTypeID( "null" ), ref );  
            desc.putEnumerated( charIDToTypeID( "Usng" ), charIDToTypeID( "ADSt" ), charIDToTypeID( method ) );  
            try {  
                executeAction( charIDToTypeID( "Algn" ), desc, DialogModes.NO );  
            } catch(e){}  
        }  
    }
}

function groupLayers() {
    for (var i = 0; i < layerNo; i++) {
        layerRef = activeLay.layers[i];
        
        if( layerRef.kind != LayerKind.NORMAL && layerRef.kind != LayerKind.SMARTOBJECT) return;
        var newLayerSet = docRef.layerSets.add(); // Make a new Group for every Image
        newLayerSet.move(layerRef, ElementPlacement.PLACEBEFORE); // Move each Group behind each Layer
        layerRef.move(newLayerSet, ElementPlacement.INSIDE); // Place each Image inside a Group
        //var logo = docRef.layers.getByName("client-logo-master"); // Duplicate 'client-logo-master' and place inside the Group
        //logo.duplicate(newLayerSet, ElementPlacement.INSIDE);
        //logo.visible = true;
    }
}

imageDimensions();
groupLayers();
app.preferences.rulerUnits = defaultRulerUnits; // restore the ruler
alert(activeLay.layers.length + " Images resized!"); // Show image count