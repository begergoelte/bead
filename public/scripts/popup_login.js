
//$("a[href='/login']").ready(function(){
/*$(document).on('click', "a[href='/login']", function (e) {
      $("form[action='/register']").hide()
      if($("div[class='modal-content'] a[name='sup']").length<2){
        $("button[type='Submit']").parent().append(
        "<a name='sup' class='btn btn-success' href='/login'><i class='glyphicon glyphicon-log-in'  style='padding-right:10px'></i>Sign Up</a>"
      )}

     // $("div[class='modal-dialog modal-md'] i").hide();
     // $("div[class='modal-dialog modal-md'] button").prepend("<center>"); 
     // $("div[class='modal-dialog modal-md'] button").append("</center>"); 
    })
*/

$("a[href='/login']").on('click', function (e) {

  e.preventDefault()
  
  const $modal = $('#loginModal')
  if ($modal.length>0) {
    $modal.modal('show')
  } else {
    console.log("zopo")
    const $modal = $(`
      <div class="modal fade confirm-modal" tabindex="-1" role="dialog" id="loginModal">
        <div class="modal-dialog modal-md" role="document">
          <div class="modal-content">
            <div class="modal-header">Login / Sign Up</div>
            <div class="modal-body">
              <div class="alert alert-danger"></div>
              <div class="form-area"></div>
            </div>
          </div>
        </div>
      </div>
    `)
    const $formContainer = $modal.find('.form-area')
    const $errorContainer = $modal.find('.alert').hide()
    $formContainer.load('/login form', function () {
      $modal.modal('show')
      const $form = $modal.find('form')
      $form.on('submit', function(e) {
        console.log("ok");
        e.preventDefault()
        const data = $(this).serializeArray()
        Promise.resolve(
          $.ajax({
            url: 'ajax/login',
            method: 'POST',
            data,
            dataType: 'json',
            headers: { 'csrf-token': $('[name="_csrf"]').val() }
          })
        )
          .then(json => {
            console.log("helo");
            if (json.success) {
              $('#navContainer').load('/ ', function() {
                console.log("hellllllo");
                $modal.modal('hide')
              })
            } else {
              console.log(json);
              $errorContainer.show().text('Nem megfelelő adatok')
            }
          })
          
          .catch(err => console.log(err))
      })  
    })
  }


  

  

})
//function scripts(){
//  var millisecondsToWait = 500;
//setTimeout(function() {
    // Whatever you want to do after the wait

    
    
  //  }, millisecondsToWait);
//}


