
window.onload = function () {
  // dwIframeDiv：遮罩範圍。dwIframe：顯示瀏覽器建議頁面
  var dwIframeDiv = document.createElement('div');

  if (dwIframeDiv) {
    try { // 以IE6支援的語法設樣式
      dwIframeDiv.id = 'dwIframeDiv';
      dwIframeDiv.style.width = '100%';
      dwIframeDiv.style.height = '100%';
      dwIframeDiv.style.display = 'block';
      dwIframeDiv.style.position = 'absolute';
      dwIframeDiv.style.top = '0px';
      dwIframeDiv.style.zIndex = '2001';
    } catch (error) {
      console.log(error);
    }

    var dwIframe = document.createElement('iframe');

    if (dwIframe) {
      try {
        dwIframe.id = 'dwIframe';
        dwIframe.style.position = 'fixed';
        dwIframe.style.width = '100%';
        dwIframe.style.height = '100%';
        dwIframe.style.display = 'block';
      } catch (error) {
        console.log(error);
      }

      dwIframe.src = 'assets/dw-framework/dw-index.html';
      dwIframeDiv.appendChild(dwIframe);
    }

    document.body.appendChild(dwIframeDiv);
  }
}
