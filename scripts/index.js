document.addEventListener('DOMContentLoaded', function () {
  const campiButtons = document.querySelectorAll('#campi button')

  async function handleCampiButtonClick(event) {
    const ocupacoesContainer = document.querySelector('#ocupacoes')
    ocupacoesContainer.innerHTML = ''

    campiButtons.forEach((button) => button.classList.remove('active'))

    const campi = event.target
    campi.classList.add('active')
    console.log(campi)

    const data = await fetch('http://127.0.0.1:8000/list/campi/ocup/' + campi.id, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.log(error))

    console.log(data)

    data.forEach((vaga) => {
      const element = `
        <span class="item" id="${vaga['CodCBO']}"><button>${vaga['Ocupação']}</button></span>
      `
      ocupacoesContainer.innerHTML += element
    })
  }

  campiButtons.forEach((button) => button.addEventListener('click', handleCampiButtonClick))

})
