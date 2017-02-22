Working, but may display errors.

All scripts work on a selected folder. Whatever images or groups are inside the folder you have selected, the script will run on. 

If you have selected a group called ‘Processing’ (can be named whatever) the script will run only on the first level images or groups inside of it.

> Processing
    Image-01.jpg
  > Image-02
      Adjustment-layer
      Image-02.jpg
    Image-03.jpg

> Exported
  Image-01.jpg
  Image-02.jpg
  Image-03.jpg

fit-to-canvas.jsx runs through each image or group inside of the selected group and resizes them based on the height or width of the document.

rename-images.jsx runs through each image of group inside of the selected group and renames them based on your input and their order.

export-to-jpg8.jsx runs through each image or group inside of the selected group and exports them into the folder of your choosing to a quality of 8.

export-to-jpg12.jsx runs through each image or group inside of the selected group and exports them into the folder of your choosing to a quality of 12.