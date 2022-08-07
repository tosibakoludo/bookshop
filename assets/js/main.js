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

// function ispisiFilterPisaca(data) {
//     console.log(data);
// }

//arrow function expression
const ispisiFilterPisaca = (data) => {
    let ispis = '';
    data.forEach(elem => {
        ispis += `<li class="list-group-item">
        <input type="checkbox" value="${elem.id}" class="pisac" name="pisci"/> ${elem.ime} ${elem.prezime}
     </li>`
    });
    document.getElementById("pisci").innerHTML = ispis;
}

dohvatiPodatke("pisci.json", ispisiFilterPisaca);
dohvatiPodatke("zanrovi.json", ispisiZanrove);

function ispisiZanrove(data) {
    let ispis = "";
    data.forEach(elem => {
        ispis += `<li class="list-group-item">
        <input type="checkbox" value="${elem.id}" class="zanr" name="zanrovi"/> ${elem.naziv}
     </li>`
    });
    document.getElementById("zanrovi").innerHTML = ispis;
}

dohvatiPodatke("knjige.json", ispisiKnjige);

function ispisiKnjige(data) {
    let ispis = "";
    data.forEach(book => {
        ispis += `<div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100">
        <img src="assets/img/${book.slika.src}" class="card-img-top" alt="${book.naslov}">
        <div class="card-body">
          <h3 class="card-title">${book.naslov}</h3>
          <h4>${book.pisacID}</h4>
          <h5>${book.price.novaCena}</h5>
          <h6><s>${book.price.staraCena}</s></h6>
          <p class="text-primary">${book.naStanju ? "Knjiga je dostupna" : "Knjiga nije dostupna"}</p>
          <p class="card-text">${book.zanrovi}</p>
        </div>
        </div>
        </div>`
    });

    if (data.length == 0) {
        ispis = "Nema knjiga";
    }
    document.getElementById("knjige").innerHTML = ispis;
}