dohvatiPodatke("pisci.json", ispisiFilterPisaca);

function dohvatiPodatke(nazivIzvora, callBack) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callBack(JSON.parse(xhr.response));
        }
    })

    xhr.open("GET", "assets/data/" + nazivIzvora);
    xhr.send();
}

function ispisiFilterPisaca(data) {
    console.log(data);
}