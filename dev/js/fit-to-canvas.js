#target photoshop

var docRef = app.activeDocument,
    activeLay = docRef.activeLayer,
    layerNo = activeLay.layers.length,
    defaultRulerUnits = app.preferences.rulerUnits; // store the ruler
    
// Convert ruler units to px
app.preferences.rulerUnits = Units.PIXELS; 

// Fit images to canvas
function imageDimensions() {
  for ( i = 0; i < layerNo; i++ ) {
    var layer = activeLay.layers[i],
        SWidth  = app.activeDocument.width.as('px'),    
        SHeight = app.activeDocument.height.as('px'),    
        bounds = layer.bounds,    
        LWidth = bounds[2].as('px')-bounds[0].as('px'),    
        LHeight = bounds[3].as('px')-bounds[1].as('px'), 
        userResampleMethod = app.preferences.interpolation; // Save interpolation settings       

    if( layer.kind != LayerKind.NORMAL && layer.kind != LayerKind.SMARTOBJECT) return;

    // Resample interpolation bicubic    
    app.preferences.interpolation = ResampleMethod.BICUBIC;

    // Smart Object layer Aspect Ratio less the Canvas area Aspect Ratio
    if ( LWidth / LHeight < SWidth / SHeight ) {
      var percentageChange = ((SWidth/LWidth)*101); // Resize to canvas area height 
      layer.resize(percentageChange,percentageChange,AnchorPosition.MIDDLECENTER)
    }

    else {
      var percentageChange = ((SHeight/LHeight)*101); // Resize to canvas area height 
      layer.resize(percentageChange,percentageChange,AnchorPosition.MIDDLECENTER)
    }

    // Reset interpolation setting   
    app.preferences.interpolation = userResampleMethod;

    // Align Layers to selection function
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
    
    // Select all
    app.activeDocument.selection.selectAll(); 
    // Run align function
    align('AdCH'); align('AdCV');
    // Deselect all
    app.activeDocument.selection.deselect();
  }
}


// Put each resized layer in a group
function groupLayers() {
  for ( i = 0; i < layerNo; i++ ) {
    layerRef = activeLay.layers[i];

    if( layerRef.kind != LayerKind.NORMAL && layerRef.kind != LayerKind.SMARTOBJECT) return;
    
    // Make a new Group for every Image
    var newLayerSet = docRef.layerSets.add();
    // Move each Group behind each Layer
    newLayerSet.move(layerRef, ElementPlacement.PLACEBEFORE);
    // Place each Image inside a Group
    layerRef.move(newLayerSet, ElementPlacement.INSIDE);
  }
}

// Run
imageDimensions();
//groupLayers();

// Restore ruler units to previous
app.preferences.rulerUnits = defaultRulerUnits;

// Fire a confirmation
alert(activeLay.layers.length + " Images resized!");