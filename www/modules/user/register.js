'use strict';


angular.module('freexf')
  .controller('register_ctrl', function ($scope, $rootScope, $injector, $ionicLoading, $timeout) {
    //$scope.home = Home.home.query({id:'1'});
    //$scope.username = (new Home.user()).getName();
//  require(['modules/index/index_ctrl'], function (shouye_ctrl) {
//    $injector.invoke(shouye_ctrl, this, {'$scope': $scope});
//  });
  })

 var mcodefun = function (urldata, obj) {
            window.mcodenum++;
            urldata = urldata + '?' + window.mcodenum;
            $.ajax({
                url: urldata,
                type: "post",
                success: function (data) {
                    $(obj).attr('src', urldata)
                }
            });
        }
        var mcodefun2 = function (urldata, obj) {
            window.mcodenum++;
            urldata = urldata + '&cad=' + window.mcodenum;
            //urldata = urldata + '&' + window.mcodenum;
            $(obj).attr('src', urldata)
        }
        var registerFun=function(data){
        	
        	if(data.success==true){
        	    //注册成功
        	    window.location.href = "registersuccess.aspx";
        	    
        	}else{
        		//注册失败
        		var ttext=data.message.split('//')[0];
        		var tobj=$(data.message.split('//')[1]).attr('dialogid');
        		dialog.get(tobj).show($(data.message.split('//')[1]).get(0)).content(ttext);
        	}
        }
        var mobileNumberAJAX = function (obj) {
            
            if (RegExpInput.eachREIfunTF({ Inputobj: $('.freexf-mobile.freexfpara-css') })) {
                if (RegExpInput.eachREIfunTF({ Inputobj: $('#ctl00_ContentPlaceHolder1_Utextbox1') })) {
                
                var mobileNumber = $('.freexf-mobile').val();
                var codeyz = $('#ctl00_ContentPlaceHolder1_Utextbox1').val();
                window.mcodenum++;
                var AJAXurl = "/home/sendcode?type=sms&mobileNumber=" + mobileNumber + '&codeyz=' + codeyz + '&cad=' + window.mcodenum;
                $.ajax({
                    url: AJAXurl,
                    type: "post",
                    success: function (data) {
                        if (data != 'success') {
                            $(obj).attr('disabled', 'disbaled');
                           
                            var dialogid = $('.freexf-mobile')
                            if (data == 'yzmfalse') {
                                mcodefun("/home/forgetpassword/validate.aspx", ".registered-box .vcode-img-box img");
                                dialog.get('ctl00_ContentPlaceHolder1_Utextbox1LPDTip').show($('#ctl00_ContentPlaceHolder1_Utextbox1').get(0));
                                dialog.get('ctl00_ContentPlaceHolder1_Utextbox1LPDTip').content('验证码错误');
                            } else {
                                if (data == 'True') {
                                    htmlDialogP.Dfun({ obj: '#readycode' })
                                } else {

                                
                                    dialog.get(dialogid.attr('dialogid')).show(dialogid.get(0));
                                    dialog.get(dialogid.attr('dialogid')).content('手机号已存在');
                                }
                            }

                            DelayMessageS(obj, 3)
                        } else {
                            DelayMessageS(obj, 60)
                            
                        }
                    }
                });
                }
            } 
            
        }
        