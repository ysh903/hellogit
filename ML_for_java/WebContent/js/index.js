//Drop된 이미지를 28*28 이미지로 만들고, 그 것의 픽셀 데이터를 얻어오는 것이 목적

function imgDrop(){
	event.preventDefault();
	//drop된 이미지의 reference를 획득 (HTML5)
	var f = event.dataTransfer.files[0]
	
	// drop된 파일의 내용을 이용하여 새로운 이미지를 만들어요.
	var newImg=new Image();
	newImg.width=200; //200*200짜리 비어있는 이미지 객체
	var resizeImg = new Image();
	resizeImg.width=28;
	
	// 파일로부터 데이터를 읽어들이기 위한 FileReader를 생성	
	var imageReader = new FileReader()
	
	// 비동기 이벤트를 위한 처리
	imageReader.onload=function(){
		
		resizeImg.onload=function(){
			// 픽셀 데이터를 뽑아내기 위한 용도
			// HTML5에서 제공하는 canvas를 생성해서 이미지를 그림.
			var myCanvas=document.createElement("canvas");
			myCanvas.width = 28;
			myCanvas.height=28;
			var ctx=myCanvas.getContext("2d");
			ctx.drawImage(resizeImg,0,0,28,28);
			
			//이렇게 canvas에 그림을 그리면 canvas로부터 픽셀데이터를 뽑아낼 수있음.
			idata=ctx.getImageData(0,0,28,28);
			//idata 안에는 3가지 정보가 들어있음 (가로길이,세로길이,픽셀에 대한 배열)
			//idata.data=> 픽셀 정보를 가지고 있는 배열
			//[0,23,12,0,0,12,...] -> 4개가 1개의 픽셀정보를 나타냄. (RGB+알파값)
			// 흑백이미지가 필요하고 [1][784] 형태의 이미지가 필요.
			// grey 형태로 이미지 변형
			var result = new Array(new Array(1),new Array(784));
			var count = 0;
			for (var i=0; i<idata.data.length;i+=4){
				var avg = (idata.data[i]+idata.data[i+1]+idata.data[i+2])/3.0;
				result[0][count++]=avg;
				// 0 -> 가장 밝은색,255 -> 가장 어두운색
				// min max scale 형태로 저장해야함.
				
				
			}
			console.log(result);
			// 필요한 픽셀정보를 확보한 후 해당 데이터를 AJAX를 이용하여 전송
			$.ajax({
				url:"http://localhost:8080/cnn/predict",
				data:{
					pData:JSON.stringify(result),
					
				},
				type:"post",
				success:function(result){
					//result:서버가 보내준 결과 데이터
					alert(result);
				},
				error: function(){
					alert("뭔가 이상해요!");
				}
			});
			
			
		}
		
		newImg.onload=function(){
			//화면에 표현하기 위한 용도
			$("#targetDiv").append(newImg);
		}
		newImg.src=event.target.result; // 비동기 처리
		resizeImg.src=event.target.result; // 비동기 처리
	}
	
	imageReader.readAsDataURL(f); // 데이터를 읽어들이기 시작
	
	
	
	
}