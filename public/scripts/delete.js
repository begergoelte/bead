

function ajaxDelete(url) {
   const headers = {
     'csrf-token': $('[name="_csrf"]').val()
   }
   return Promise.resolve(
     $.ajax({
        beforeSend: function (xhr) {

          xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));

        },
       url,
       method: 'DELETE',
       dataType: 'json',
       headers
     })
   )
 }

function my_confirm(question) {
  // return Promise.resolve(confirm(question))
  let _resolve
  let _reject

  const $modal = $('.confirm-modal')
  $modal.modal('show')

  $modal.find('.modal-ok').on('click', function (e) {
    _resolve(true)
  })

  $modal.find('.modal-cancel').on('click', function (e) {
    _resolve(false)
  })

  return new Promise(function (resolve, reject) {
    _resolve = resolve
    _reject = reject
  })
}


  $("a[class*='btn-danger']").on('click', function (e) {
    console.log("ok");
    e.preventDefault()
  // console.log(response);
    my_confirm('Biztos törölni akarod?').then(response => {
      if (response) {
        // /ajax/recipes/3/delete
        console.log($(this).attr('href'))
        const url = 'ajax' + $(this).attr('href')
        ajaxDelete(url)
          .then(data => {
            cosole.log(location.assign('/'))
            location.assign('/')
          })
          .catch(xhr => {
            $('.help-block').text(xhr.responseText)
          })
      }
    })
  })



