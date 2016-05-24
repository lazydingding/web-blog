// initialize KindEditor
var editor;
KindEditor.ready(function(K) {
   // the self-defined KindEditor for post, allow upload image
   editor = K.create('textarea[name="post"]', {
      allowImageUpload : true,
      uploadJson: '/uploadImg',
      width:"100%",
      height:"300px",
      items : [
      'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
      'italic', 'underline', 'removeformat', '|', 'justifyleft',
      'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist',
      'insertunorderedlist', '|', 'emoticons', 'image', 'link']
   });
   // the self-defined KindEditor for content, block the image upload function
   editor = K.create('textarea[name="content"]', {
      allowImageUpload : false,
      width:"100%",
      height:"100px",
      items : [
      'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
      'italic', 'underline', 'removeformat', '|', 'justifyleft',
      'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist',
      'insertunorderedlist', '|', 'emoticons', 'link']
   });
});

// set up a random background image
var randomBg = Math.round( Math.random() * 4 );
switch (randomBg) {
   case 0: document.write("<style>header{background: url('/images/01.png')}</style>");
   break;
   case 1: document.write("<style>header{background: url('/images/02.png')}</style>");
   break;
   case 2: document.write("<style>header{background: url('/images/03.png')}</style>");
   break;
   case 3: document.write("<style>header{background: url('/images/04.png')}</style>");
   break;
   default: document.write("<style>header{background: url('/images/05.png')}</style>");
}
