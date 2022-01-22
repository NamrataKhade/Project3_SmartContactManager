console.log("this is script file")
const toggleSidebar=()=>{
	
	if($('.sidebar').is(":visible")){
		//true..side bar band karna
		$(".sidebar").css("display","none");
		$(".content").css("margin-left","0%");
	}else{
		//false....show karna hai
		
			$(".sidebar").css("display","block");
		$(".content").css("margin-left","20%");
	}
};

const search=()=>{
	//console.log("searching.....");
	
	let query=$("#search-input").val();

	
	if(query=='')
	{
		$(".search-result").hide();
	}
	else{
		
		//search
			console.log(query);
			
		//sending request ti server
		
		let url=`http://localhost:8080/search/${query}`;
		
		fetch(url)
		.then((response)=>{
			return response.json();
			
		})
		.then((data)=>{
			//data..	
			
			//console.log(data);
			
			let text  =`<div class='list-group'>`;
			
			data.forEach((contact) => {
				
				text+=`<a href='/user/${contact.cId}/contact' class='list-group-item list-group-item-action'> ${contact.cname}</a>`
				
			});
			
			
			
			text+=`</div>`;
			
			$(".search-result").html(text);
			$(".search-result").show();
			
			
			
		});
		//	$(".search-result").show();
	}
	
};



//Payment Integration

//first request-to server to create order

const paymentStart=()=>{
	
	console.log("Payment Started...");
	
	let amount=$("#payment_field").val();
	console.log(amount);
	
	if(amount==''|| amount==null)
	{
		//alert("Amount is required..!!");
		swal("Failed !!", "Amount is required..!! ", "error");
		
		return;
	}
	
	//code..
	//We will use Ajax to send request to server to create order--jquery
	
	$.ajax(
		{
		 
		 url:'/user/create-order',
		 data:JSON.stringify({amount:amount,info:'order_request'}),
		 contentType:'application/json',
		 type:'POST',
		 dataType:'json',
		 success:function(response){
			//invoke where success
			console.log(response)
			
			if(response.status=='created'){
				
				//open payment form
				let options={
					key:"rzp_test_YlKKqXxbLhFmqd",
					amount:response.amount,
					currency:"INR",
					name:"Smart Contact Manager",
					description:"Donation",
					image:
					"https://www.google.com/search?tbs=sbi:AMhZZiuVYOzHh_1FgfLu8SQiF3i2IronACTlmkUQUo-LPDKu5WcfFRZvO6wCtH2SRCBdTCC8jO2UHUrqiwgEMlfqR9WcMYPUX9rycD2u7Ef8do07ubTGIdUuy7huornLsmvYBFVQKZYVBgklSFuozP3_1NH7efvFR6EfiXO5JZWp9t4LiR-MMpmqdfrDGGDiU4lvHEjLjLAhLuv6NGTpECN0EhpjcTnSSJRjZyPnJAqMBseiR9OC87D-NXGpFAKg8EFfq-eJJoM9RooZQJ2Lm4W4PK1NESHabSNbAyJnuz4KGtjBk-nIKM9fT_1syhVOrOf9gXxxXltF_18IvmdoXYWamGi-rRH5GTIfB0bwg4UkT0zlKQDEnXdsmqHiFKaNQQkVDq_1GMFYaROQ5V1o58RdXF_1VJ3y34NFArKQ",
					order_id:response.id,
					handler:function(response){
						console.log(response.razorpay_payment_id);
						console.log(response.razorpay_order_id);
						console.log(response.razorpay_signature);
						
						console.log('Payment Successfully !! ');
						//alert("Congrats !! Payment Successfully ");
						
						
						updatePaymentOnServer(response.razorpay_payment_id,
						                      response.razorpay_order_id,
						                      "paid");
						                      
						//swal("Good job!", "Congrats !! Payment Successfully ", "success");

					},
					
					 prefill: {
                              name: "",
                              email: "",
                               contact: "",
                             },
					
					 notes: {
                              address: "Namrata"
                              },
					theme: {
                             color: "#3399cc"
                             },
				};	
				
				let rzp=new Razorpay(options);
				
				rzp.on('payment.failed', function (response){
                     console.log(response.error.code);
                     console.log(response.error.description);
                     console.log(response.error.source);
                     console.log(response.error.step);
                     console.log(response.error.reason);
                     console.log(response.error.metadata.order_id);
                     console.log(response.error.metadata.payment_id);
                     //alert("Oops payment failed !!");
                    // swal("Failed !!", "Oops payment failed !! ", "error");
                    });
				
				rzp.open();
				
			}
			
			
		},
		error:function(error)
		{
			//invoke when error
			console.log(error)
			alert("Something  Went Wrong !!!")
		},
			
    });
	
};

//
function updatePaymentOnServer(payment_id,order_id,status)
{
	$.ajax(
		{
		 
		 url:"/user/update_order",
		 data:JSON.stringify({payment_id:payment_id,order_id:order_id,status: status}),
		 contentType:"application/json",
		 type:"POST",
		 dataType:"json",
		 
		 success:function(response){
			swal("Good job!", "Congrats !! Payment Successfully ", "success");
		},
		error:function(error){
			swal("Failed !!", "Your Payment is successful , But we did not get on server, we will contact you as sooon as possible !! ", "error");
		}
	     });
	
}