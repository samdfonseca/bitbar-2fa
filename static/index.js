function deleteAccount({id}) {
  return axios.delete('/accounts/'+id)
}

function createAccount({account_name, key}) {
  return axios.post('/accounts', {
    account_name,
    key
  })
}

function getAccounts() {
  return axios.get('/accounts')
}

function loadAccountsList() {
  $('#accountsList').empty()
  axios.get('/accounts').then((resp) => {
    resp.data.accounts.map((account) => {
      $('#accountsList').append(
        $('<li class="list-group-item"></li>').append(
          $(`<button type="button" class="btn btn-primary delete-account-btn" autocomplete="off">Delete Account</button>`).click(() => {
            deleteAccount(account).then((resp) => { loadAccountsList() }).catch((err) => { loadAccountsList() })
          }),
          `<span>${account.account_name} - ${account.key}</span>`
        )
      )
    })
  })
}


$(function() {
  loadAccountsList()
})
