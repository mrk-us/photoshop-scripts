var docRef = app.activeDocument,
    activeLay = docRef.activeLayer,
    layerNo = activeLay.layers.length;

function prompts() {
  var currentDate = new Date(),
      month = currentDate.getMonth() + 1, // Start at 1 (January is 0 by default)
      year = currentDate.getFullYear();

  // Add a 0 before single digit numbers
  if ( month < 10 ) { month = '0' + month } 

  // Construct currentDate
  currentDate = year + "-" + month;

  // Prompt user to change name of images
  imageName = prompt("Prefix Image Names", activeDocument.name.replace(".psd", "").replace(/ /g, "-").replace("_", "-"));
  
  // Prompt user to change name of Folder (Defaults to 'Year-Month-d')
  folderName = prompt("Folder Name", currentDate + "-d");
}

function renameLayers() {
  var digit = 1;
  for ( i = 0; i < layerNo; i++ ) {
    var layerRef = activeLay.layers[i];

    // Always use double digits
    if ( digit < 10 ) {
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

// Create a group to move images into
function createNewGroup() {
    var groupMonth = docRef.layerSets.add();
    groupMonth.name = folderName;
    var group = activeLay;
    groupMonth.moveAfter(group);
}

// Run
prompts();
renameLayers();
createNewGroup();