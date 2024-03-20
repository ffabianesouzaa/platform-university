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

    data.rows.forEach((vaga) => {
      const element = `
        <span class="item" id="${vaga}"><button>${vaga}</button></span>
      `
      ocupacoesContainer.innerHTML += element

    })

    document.querySelector('#bar-ocupadas').style.width = `${data.ocupadas}`
    const total = data.ocupadas + data.nocupadas
    const percentageOcupadas = (data.ocupadas * 100) / total
    const percentageNocupadas = 100 - percentageOcupadas

    const barOcupadas = document.querySelector('#bar-ocupadas')
    const barNocupadas = document.querySelector('#bar-nocupadas')

    barOcupadas.style.width = `${percentageOcupadas}%`
    barNocupadas.style.width = `${percentageNocupadas}%`

  }

  campiButtons.forEach((button) => button.addEventListener('click', handleCampiButtonClick))

})
