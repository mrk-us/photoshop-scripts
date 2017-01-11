#target photoshop

var ref = app.activeDocument;

function main() {
    var layerNo = ref.layerSets.getByName("Processing").layers.length;
    var i = 0; i < layerNo; i++;
    var layerRef = ref.layerSets.getByName("Processing").layers[i];
            
        if (layerRef.name = "Image") {
            prompts();
            groupLayers();
            renameLayers();
            createNewGroup();
            closeAllLayerSets(app.activeDocument);
            alert("Boom! Images exported to:\n" + imageName + "-assets/" + folderName + "/");
        }
        else {
            alert("No Images");
        }
}

function prompts() {
    var currentDate = new Date(); // Get current year and month
    var mm = currentDate.getMonth()+1; // January is 0
    var yyyy = currentDate.getFullYear();
    if(mm<10) { mm = '0' + mm } 
    currentDate = yyyy + "-" + mm;
    
    imageName = prompt("Prefix Image Names", activeDocument.name.replace(".psd", "").replace(/ /g, "-").replace("_", "-")); // Prompt user to change name of images
    
    folderName = prompt("Folder Name", currentDate + "-d"); // Prompt user to change name of Folder (Defaults to 'Year-Month-d')
}

function groupLayers() {
    var layerNo = ref.layerSets.getByName("Processing").layers.length;
    for (var i = 0; i < layerNo; i++) {
        var layerRef = ref.layerSets.getByName("Processing").layers[i]; // List the number of Images
        
        if( layerRef.kind != LayerKind.NORMAL && layerRef.kind != LayerKind.SMARTOBJECT) return;
        var newLayerSet = ref.layerSets.add(); // Make a new Group for every Image
        newLayerSet.move(layerRef, ElementPlacement.PLACEBEFORE); // Move each Group behind each Layer
        layerRef.move(newLayerSet, ElementPlacement.INSIDE); // Place each Image inside a Group
        var logo = ref.layers.getByName("client-logo-master"); // Duplicate 'client-logo-master' and place inside the Group
        logo.duplicate(newLayerSet, ElementPlacement.INSIDE);
        logo.visible = true;
    }
}

function renameLayers() {
    var digit = 1;
    var layerNo = ref.layerSets.getByName("Processing").layers.length; // List the number of groups
    
    for (var i = 0; i < layerNo; i++) {
        layerRef = ref.layerSets.getByName("Processing").layers[i];

        // Always use double digits
        if (digit < 10) {
            // Prefix Group name with prompt input, Document name, and suffix sequentially
            layerRef.name = layerRef.name = folderName + "/" + imageName + "-" + "0" + digit + ".jpg8" // Rename each group within the 'Processing' group
        }
        else {
            // Prefix Group name with prompt input, Document name, and suffix sequentially
            layerRef.name = layerRef.name = folderName + "/" + imageName + "-" + digit + ".jpg8" // Rename each group within the 'Processing' group
        }
        layerRef.name = layerRef.name.replace(".psd", "") // Remove '.psd' from the Group name if Document has it
        digit = digit + 1;
    }
}

function createNewGroup() {
    var groupMonth = ref.layerSets.add();
    groupMonth.name = folderName;
    var group = ref.layerSets.getByName("Processing");
    groupMonth.moveAfter(group);
}

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

closeAllLayerSets(app.activeDocument); // Collapse layers

main(); // Run