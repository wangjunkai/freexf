<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no,width=device-width">
  <meta name="MobileOptimized" content="320">
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
  <meta name="screen-orientation" content="portrait">
  <meta name="x5-orientation" content="portrait">
  <meta content="telephone=no" name="format-detection">
  <script>

  </script>
  <title></title>
  <style type="text/css">
    ng-cloak {
      display: none;
    }

    #doyoo_panel {
      display: none
    }
  </style>
  <link href="lib/ionic/css/ionic.min.css" rel="stylesheet">
  <script type="text/javascript">
      window.hostType = 1;
      window.versionsNum = '?v=<%=tf_GetStyleTimeStamp()%>';
    (function () {
      var headEl = document.getElementsByTagName('head')[0], sync = true;
      var css = {
        0: ['css/freexf.css', 'css/course.css', 'css/home.css', 'css/pay.css',
          'css/user.css', 'css/set.css', 'css/member.css', 'css/ExaminationPaper.css',
          'activities/css/public.css',
          'activities/css/examinationTime.css',
          'activities/css/invitefriends.css',
          'activities/css/classlearing.css',
          'activities/css/multilingual.css',
          'activities/css/microClass.css',
          'activities/css/oneBuy.css',
          'activities/css/lottery.css',
          'activities/css/teacherteam.css',
          'activities/css/courseDiscount.css',
          'activities/css/cetMultilingual.css',
          'activities/css/fourFoldCarnival.css'
          ],
        1: [
          'activities/css/activities-b4fa021210.bundle.css',
          'css/freexf-0d12eba003.bundle.css'
          ]
      };
      var js = {
        0: [''],
        1: ['']
      };
      for (var i = 0, j = css[window.hostType]; i < j.length; i++) {
          addTag('link', { rel: 'stylesheet', href: j[i] +window.versionsNum });
      }
      for (var q = 0, w = js[window.hostType]; q < w.length; q++) {
        addTag('script', {src: w[q]}, sync);
      }

      function addTag(name, attributes, sync) {
        var el = document.createElement(name),
          attrName;

        for (attrName in attributes) {
          el.setAttribute(attrName, attributes[attrName]);
        }
        sync ? document.write(outerHTML(el)) : headEl.appendChild(el);
      }

      function outerHTML(node) {
        // if IE, Chrome take the internal method otherwise build one
        return node.outerHTML || (function (n) {
            var div = document.createElement('div'), h;
            div.appendChild(n);
            h = div.innerHTML;
            div = null;
            return h;
          })(node);
      }
    })();
  </script>
</head>
<body >

<ion-nav-view>
</ion-nav-view>
<!--require按需加载js控件-->
<script data-main="config.js?v=<%=tf_GetStyleTimeStamp()%>" src="dist/js/lib/require-01ccd14836.js?v=<%=tf_GetStyleTimeStamp()%>"></script>
<div class="udeskfun" style="position:absolute;top:-1px;left:-1px;width:0px;height:0px;"></div>
    <%
        If Component.WebContextBase.ConextItem(LsFreeXFDataAccess.DataAccess.ObjApes_Traffic.Apes_URLShort) = "" Then

            Dim lb_Flag As Boolean

            lb_Flag = tf_URLShort("bdkeyword")
            If lb_Flag = False Then
                lb_Flag = tf_URLShort("mbdkeyword")
            End If
            If lb_Flag = False Then
                lb_Flag = tf_URLShort("360keyword")
            End If
            If lb_Flag = False Then
                lb_Flag = tf_URLShort("m360keyword")
            End If
            If lb_Flag = False Then
                lb_Flag = tf_URLShort("keyword")
            End If
            If lb_Flag = False Then
                lb_Flag = tf_URLShort("sogoukeyword")
            End If
            If lb_Flag = False Then
                lb_Flag = tf_URLShort("msogoukeyword")
            End If
        End If

        Call LsFreeXFDataAccess.DataAccess.ObjApes_Traffic.Log访问()
     %>

</body>

</html>
