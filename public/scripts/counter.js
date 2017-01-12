


var count = 1;
const $panels =$("div[id='counter']")

$panels.each(function () {
  $(this).text("("+count+")");
  count++; 
})