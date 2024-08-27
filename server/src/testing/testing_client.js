
window.onload = async function () {
    var chart = klinecharts.init('chart')
    const response = await fetch('http://localhost:3000/api/chart');
    let arr = await response.json()
    chart.applyNewData(arr)
    }
