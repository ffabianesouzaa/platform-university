document.addEventListener('DOMContentLoaded', function () {

  //Ao clicar em um botão
  async function handleOcupButtonClick(event) {
    const ocupButtons = document.querySelectorAll('#ocupacoes button')
    ocupButtons.forEach((button) => button.classList.remove('active'))
    const ocupButton = event.target
    ocupButton.classList.add('active')
    console.log(ocupButton)

    const hardSkills = document.querySelector('#hard')
    hardSkills.innerHTML = ''

    const barOcupadas = document.querySelector('#bar-ocupadas')
    const barNocupadas = document.querySelector('#bar-nocupadas')

    const barLabelOcupadas = document.querySelector('#ocupadas-label')
    const barLabelNocupadas = document.querySelector('#nocupadas-label')

    const campiId = ocupButton.getAttribute('data-campi-id')

    const data = await fetch(`http://127.0.0.1:8000/list/campi/ocup/total/${campiId}/${ocupButton.id}/`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.log(error))

    console.log(data)

    const total = data.ocupadas + data.nocupadas
    const percentageOcupadas = (data.ocupadas * 100) / total
    const percentageNocupadas = 100 - percentageOcupadas



    barOcupadas.style.width = `${percentageOcupadas}%`
    barNocupadas.style.width = `${percentageNocupadas}%`

    if (percentageOcupadas < 1) {
      barLabelOcupadas.style.display = 'none'
    }
    else {
      barLabelOcupadas.style.display = 'block'
    }

    if (percentageNocupadas < 1) {
      barLabelNocupadas.style.display = 'none'
    }
    else {
      barLabelNocupadas.style.display = 'block'
    }

    barLabelOcupadas.style.width = `${percentageOcupadas}%`
    barLabelNocupadas.style.width = `${percentageNocupadas}%`

    barOcupadas.innerHTML = data.ocupadas
    barNocupadas.innerHTML = data.nocupadas

    hardSkills.innerHTML = data.hard.map((skill) => `<li>${skill}</li>`).join('');

  }

  const campiButtons = document.querySelectorAll('#campi button')
  async function handleCampiButtonClick(event) {
    const ocupacoesContainer = document.querySelector('#ocupacoes')
    ocupacoesContainer.innerHTML = ''
    const hardSkills = document.querySelector('#hard')
    hardSkills.innerHTML = ''

    const barOcupadas = document.querySelector('#bar-ocupadas')
    const barNocupadas = document.querySelector('#bar-nocupadas')

    const barLabelOcupadas = document.querySelector('#ocupadas-label')
    const barLabelNocupadas = document.querySelector('#nocupadas-label')

    let ocupButtons = document.querySelectorAll('#ocupacoes button')
    if (ocupButtons.length) {
      ocupButtons.forEach((button) => button.removeEventListener('click', handleOcupButtonClick))
    }
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
        <span class="item"><button id="${vaga}" data-campi-id="${campi.id}">${vaga}</button></span>
      `
      ocupacoesContainer.innerHTML += element

    })

    const total = data.ocupadas + data.nocupadas
    const percentageOcupadas = (data.ocupadas * 100) / total
    const percentageNocupadas = 100 - percentageOcupadas

    barOcupadas.style.width = `${percentageOcupadas}%`
    barNocupadas.style.width = `${percentageNocupadas}%`

    if (percentageOcupadas < 1) {
      barLabelOcupadas.style.display = 'none'
    }
    else {
      barLabelOcupadas.style.display = 'block'
    }

    if (percentageNocupadas < 1) {
      barLabelNocupadas.style.display = 'none'
    }
    else {
      barLabelNocupadas.style.display = 'block'
    }

    barLabelOcupadas.style.width = `${percentageOcupadas}%`
    barLabelNocupadas.style.width = `${percentageNocupadas}%`

    barOcupadas.innerHTML = data.ocupadas
    barNocupadas.innerHTML = data.nocupadas

    ocupButtons = document.querySelectorAll('#ocupacoes button')
    ocupButtons.forEach((button) => button.addEventListener('click', handleOcupButtonClick))
  }

  campiButtons.forEach((button) => button.addEventListener('click', handleCampiButtonClick))

})
