var docRef = app.activeDocument,
    activeLay = docRef.activeLayer,
    layerNo = activeLay.layers.length;

// Prompt to confirm or change export folder name
function createExportFolder() {
  var currentDate = new Date(),
      month = currentDate.getMonth() + 1, // Start at 1 (January is 0 by default)
      year = currentDate.getFullYear();

  // Add a 0 before single digit numbers
  if ( month < 10 ) { month = '0' + month } 

  // Construct currentDate
  currentDate = year + "-" + month;

  // Prompt user to change name of Folder (Defaults to 'Year-Month-d')
  folderName = prompt("Folder Name", currentDate + "-d");
}

// Export Save for Web in the current folder
function savePNG() {
  for ( i = 0; i < layerNo; i++ ) {
    var root = docRef.path,
        output = new Folder(root + "/" + folderName + "/");
    
    //Options to export to PNG files
    pngOptions = new PNGSaveOptions()
    pngOptions.compression = 0
    pngOptions.interlaced = false
    
    layerRef = activeLay.layers[i];
    
    // If no folder exists then create one
    if ( !output.exists ) { output.create(); }
    
    // For each layer in list: Make visible, export then hide
    layerRef.visible = true;
    docRef.saveAs(File(output +"/"+ layerRef.name), PNGSaveOptions, true); 
    layerRef.visible = false;
  }
}

// Set all layers/groups to visible after savePNG() function
function ShowAllGroups() {
  for ( i = 0; i < layerNo; i++) {
    layerRef = activeLay.layers[i];
    layerRef.visible = true;
  }
}

// Run
createExportFolder();
savePNG();
ShowAllGroups();