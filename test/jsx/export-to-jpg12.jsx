var docRef = app.activeDocument;
var activeLay = docRef.activeLayer;
var layerNo = activeLay.layers.length;

prompts();
//renameLayers();
//createNewGroup();
saveJpeg();
ShowAllGroup();

function prompts() {
    var currentDate = new Date(); // Get current year and month
    var mm = currentDate.getMonth()+1; // January is 0
    var yyyy = currentDate.getFullYear();
    if(mm<10) { mm = '0' + mm } 
    currentDate = yyyy + "-" + mm;
    
    //imageName = prompt("Prefix Image Names", activeDocument.name.replace(".psd", "").replace(/ /g, "-").replace("_", "-")); // Prompt user to change name of images
    
    folderName = prompt("Folder Name", currentDate + "-d"); // Prompt user to change name of Folder (Defaults to 'Year-Month-d')
}

function renameLayers() {
    var digit = 1;

    for (var i = 0; i < layerNo; i++) {
        layerRef = activeLay.layers[i];
        // Always use double digits
        if (digit < 10) {
            // Prefix Group name with prompt input, Document name, and suffix sequentially
            layerRef.name = layerRef.name = imageName + "-" + "0" + digit // Rename each group within the 'Processing' group
        }
        else {
            // Prefix Group name with prompt input, Document name, and suffix sequentially
            layerRef.name = layerRef.name = imageName + "-" + digit // Rename each group within the 'Processing' group
        }
        layerRef.name = layerRef.name.replace(".psd", "") // Remove '.psd' from the Group name if Document has it
        digit = digit + 1;
    }
}

function createNewGroup() {
    var groupMonth = docRef.layerSets.add();
    groupMonth.name = folderName;
    var group = docRef.layerSets.getByName("Processing");
    groupMonth.moveAfter(group);
}

function hideLayers() {
    for (var i = 0; i < layerNo; i++) {
        layerRef = activeLay.layers[i];
        layerRef.visible = false;
    }
}

function showLayers() {
    for (var i = 0; i < layerNo; i++) {
        layerRef = activeLay.layers[i];
        layerRef.visible = true;
    }
}

function ShowAllGroup() {
    for (var i = 0; i < layerNo; i++) {
        layerRef = activeLay.layers[i];
        layerRef.visible = true;
    }
}

//Export Save for Web in the current folder
function saveJpeg() {
    
    //Options to export to JPG files
    var jpegSaveOptions = new JPEGSaveOptions(); 
    jpegSaveOptions.quality = 12;
    
    for (var i = 0; i < layerNo; i++) {
        layerRef = activeLay.layers[i];
        var root = docRef.path;
        var output = new Folder(root + "/" + folderName + "/");
        if (!output.exists) {
            output.create();
        }
        layerRef.visible = true;
        docRef.saveAs(File(output +"/"+ layerRef.name), jpegSaveOptions, true); 
        layerRef.visible = false;
    }
}


// Collapse all groups
function cTID(s){return charIDToTypeID(s)}  
function sTID(s){return stringIDToTypeID(s)}  

function closeAllLayerSets(ref) {  
          var layers = ref.layers;  
          var len = layers.length;  
          for ( var i = 0; i < len; i ++) {  
                    var layer = layers[i];  
                    if (layer.typename == 'LayerSet') {ref.activeLayer = layer; closeGroup(layer); var layer = layers[i]; closeAllLayerSets(layer);};  
          }  
}  

function hasLayerMask() {  
   var m_Ref01 = new ActionReference();  
   m_Ref01.putEnumerated( sTID( "layer" ), cTID( "Ordn" ), cTID( "Trgt" ));  
   var m_Dsc01= executeActionGet( m_Ref01 );  
   return m_Dsc01.hasKey(cTID('Usrs'));  
}        

function addLayer() {  
   var m_ActiveLayer          =    activeDocument.activeLayer;  
   var m_NewLayer             =    activeDocument.artLayers.add();  
   m_NewLayer.move(m_ActiveLayer, ElementPlacement.PLACEBEFORE);  

   return m_NewLayer;  
}

function addToSelection(layerName) {  
   var m_Dsc01 = new ActionDescriptor();  
   var m_Ref01 = new ActionReference();  
   m_Ref01.putName( cTID( "Lyr " ), layerName );  
   m_Dsc01.putReference( cTID( "null" ), m_Ref01 );  
   m_Dsc01.putEnumerated( sTID( "selectionModifier" ), sTID( "selectionModifierType" ), sTID( "addToSelection" ) );  
   m_Dsc01.putBoolean( cTID( "MkVs" ), false );  

   try {  
      executeAction( cTID( "slct" ), m_Dsc01, DialogModes.NO );  
   } catch(e) {}  
}  

function groupSelected(name) {  
   var m_Dsc01 = new ActionDescriptor();  
   var m_Ref01 = new ActionReference();  
   m_Ref01.putClass( sTID( "layerSection" ) );  
   m_Dsc01.putReference(  cTID( "null" ), m_Ref01 );  
   var m_Ref02 = new ActionReference();  
   m_Ref02.putEnumerated( cTID( "Lyr " ), cTID( "Ordn" ), cTID( "Trgt" ) );  
   m_Dsc01.putReference( cTID( "From" ), m_Ref02 );  
   var m_Dsc02 = new ActionDescriptor();  
   m_Dsc02.putString( cTID( "Nm  " ), name);  
   m_Dsc01.putObject( cTID( "Usng" ), sTID( "layerSection" ), m_Dsc02 );  
   executeAction( cTID( "Mk  " ), m_Dsc01, DialogModes.NO );  

   return activeDocument.activeLayer;  
}      

function closeGroup(layerSet) {  
   var m_Name = layerSet.name;  
   var m_Opacity = layerSet.opacity;  
   var m_BlendMode = layerSet.blendMode;  
   var m_LinkedLayers = layerSet.linkedLayers;  

   var m_bHasMask = hasLayerMask();  
   if(m_bHasMask) loadSelectionOfMask();  


      activeDocument.activeLayer = layerSet;  
      ungroup();  
      groupSelected(m_Name);  


   var m_Closed = activeDocument.activeLayer;  
   m_Closed.opacity = m_Opacity;  
   m_Closed.blendMode = m_BlendMode;  

   for(x in m_LinkedLayers) {  
      if(m_LinkedLayers[x].typename == "LayerSet")  
         activeDocument.activeLayer.link(m_LinkedLayers[x]);  
   }  

   if(m_bHasMask) maskFromSelection();  

   return m_Closed;  
}  

function ungroup() {  
   var m_Dsc01 = new ActionDescriptor();  
   var m_Ref01 = new ActionReference();  
   m_Ref01.putEnumerated( cTID( "Lyr " ), cTID( "Ordn" ), cTID( "Trgt" ) );  
   m_Dsc01.putReference( cTID( "null" ), m_Ref01 );  

   try {  
      executeAction( sTID( "ungroupLayersEvent" ), m_Dsc01, DialogModes.NO );  
   } catch(e) {}  
}  

//closeAllLayerSets(app.activeDocument);