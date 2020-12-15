var albumBucketName = "cf-stack-ablum-photo";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:2a86ba5a-280d-4c46-ae39-38a98441eea0";
AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: albumBucketName }
});



function submitform(){
  console.log("Hello world!")
  console.log("Hello world!!!!!!!!!!!!!!!!!!!!!!!!!")
  var apigClient = apigClientFactory.newClient();
  var searchstring = document.getElementById("input").value;
  console.log(searchstring)

  var slider = document.getElementById("slider");
  while (slider.hasChildNodes()) {  
    slider.removeChild(slider.firstChild);
  }

  var ablum = document.getElementById("ablum");
  while (ablum.hasChildNodes()) {  
    ablum.removeChild(ablum.firstChild);
  }

  return apigClient.searchGet({q: searchstring}, {"String":"helloworld"}, {});
}


function sendmessage(){
  submitform().then((response) => {
    console.log("Hello world!");
    console.log(response);
    console.log(response["data"]);
    url_array = response["data"].split(",")
    url_array.pop()
    console.log(url_array);

    var i;
    for (i = 0; i <url_array.length;i++){
      console.log(i)
      url = url_array[i]
      if (i ==0){
        var slider = document.createElement("li");
        slider.setAttribute('data-target', '#carouselExampleIndicators')
        slider.setAttribute('data-slide-to', i)
        slider.setAttribute('class', "active")

        document.getElementById("slider").appendChild(slider);

        var div = document.createElement("div");
        div.setAttribute('class', 'carousel-item active')
        div.setAttribute('id', i + "-image")
        document.getElementById("ablum").appendChild(div);
        var image = document.createElement("img");
        image.setAttribute('src', url);
        image.setAttribute('class',"d-block w-100");
        image.setAttribute('alt',"...");
        document.getElementById(i + "-image").appendChild(image);
      }
      else{
        var slider = document.createElement("li");
        slider.setAttribute('data-target', '#carouselExampleIndicators')
        slider.setAttribute('data-slide-to', i)
        document.getElementById("slider").appendChild(slider);

        var div = document.createElement("div");
        div.setAttribute('class', 'carousel-item')
        div.setAttribute('id', i + "-image")
        document.getElementById("ablum").appendChild(div);
        var image = document.createElement("img");
        image.setAttribute('src', url);
        image.setAttribute('class',"d-block w-100");
        image.setAttribute('alt',"...");
        document.getElementById(i + "-image").appendChild(image);
      }
    }


  }).catch((error) => {
        console.log('an error occurred', error);
      });
}

function addPhoto() {
  var albumName = "adsfdasf"
  var files = document.getElementById("exampleFormControlFile1").files;
  if (!files.length) {
    return alert("Please choose a file to upload first.");
  }
  var file = files[0];
  var fileName = file.name;
  var albumPhotosKey = encodeURIComponent(albumName) + "/";

  var photoKey = fileName;

  // Use S3 ManagedUpload class as it supports multipart uploads
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: albumBucketName,
      Key: photoKey,
      Body: file,
      ACL: "public-read"
    }
  });

  var promise = upload.promise();

  promise.then(
    function(data) {
      alert("Successfully uploaded photo.");
      viewAlbum(albumName);
    },
    function(err) {
      return alert("There was an error uploading your photo: ", err.message);
    }
  );
}

document.getElementById('upload').addEventListener('click', addPhoto);
document.getElementById('search').addEventListener('click', sendmessage);