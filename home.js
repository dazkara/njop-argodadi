const selectBtn1 = document.querySelector(".select-btn1");
const selectBtn2 = document.querySelector(".select-btn2");
const selectBtn3 = document.querySelector(".select-btn3");
const items1 = document.querySelectorAll(".item1");
const items2 = document.querySelectorAll(".item2");
const items3 = document.querySelectorAll(".item3");

// Menambahkan event listener untuk toggle button 1
selectBtn1.addEventListener("click", () => {
    selectBtn1.classList.toggle("open");
});

// Menambahkan event listener untuk toggle button 2
selectBtn2.addEventListener("click", () => {
    selectBtn2.classList.toggle("open");
});

// Menambahkan event listener untuk toggle button 3
selectBtn3.addEventListener("click", () => {
    selectBtn3.classList.toggle("open");
});

// Menambahkan event listener untuk setiap item dropdown Layer dan Buffer
items1.forEach(item => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const itemText = item.querySelector(".item-text");

    checkbox.addEventListener("change", () => { 
        item.classList.toggle("checked1"); 

        let checkedItems1 = document.querySelectorAll(".item1.checked1");
        let btnText1 = document.querySelector(".select-btn1 .btn-text");

        if (checkedItems1 && checkedItems1.length > 0) {
            btnText1.innerText = `${checkedItems1.length} Dipilih`;
        } else {
            btnText1.innerText = "Estimasi NJOP";
        }
    });
});

// Menambahkan event listener untuk setiap item dropdown Layer dan Buffer
items2.forEach(item => {
    const checkbox = item.querySelector("input[type='checkbox']"); 
    const itemText = item.querySelector(".item-text"); 

    checkbox.addEventListener("change", () => { 
        item.classList.toggle("checked2"); 
        let checkedItems2 = document.querySelectorAll(".item2.checked2");
        let btnText2 = document.querySelector(".select-btn2 .btn-text");

        if (checkedItems2 && checkedItems2.length > 0) {
            btnText2.innerText = `${checkedItems2.length} Dipilih`;
        } else {
            btnText2.innerText = "Buffer Lahan Positif";
        }
    });
});


// Menambahkan event listener untuk setiap item dropdown Layer dan Buffer
items1.forEach(item => {
    const checkbox = item.querySelector("input[type='checkbox']"); 
    const itemText = item.querySelector(".item-text"); 

    checkbox.addEventListener("change", () => {
        item.classList.toggle("checked3");
        let checkedItems3 = document.querySelectorAll(".item3.checked3");
        let btnText3 = document.querySelector(".select-btn3 .btn-text");

        if (checkedItems3 && checkedItems3.length > 0) {
            btnText3.innerText = `${checkedItems3.length} Dipilih`;
        } else {
            btnText3.innerText = "Buffer Lahan Negatif";
        }
    });
});


$(document).ready(function() {
    var currentLocation = window.location.href;
    
    $('.nav_link').each(function() {
      if ($(this).attr('href') === currentLocation) {
        $(this).addClass('active');
      }
    });
  
    $('.nav_link').click(function() {
      $('.nav_link').removeClass('active');
      $(this).addClass('active');
    });

    if (window.location.pathname === '/index.html') {
      $('#halamanUtama').addClass('active');
    }
  });

// Fungsi untuk menampilkan/menyembunyikan layer GeoJSON
function toggleLayer(layerName) {
    var geojsonUrl;
    var styleOptions = {};
    var layer = null;

    switch (layerName) {
        case 'estimasiNJOP':
            geojsonUrl = 'geojson/estimasi.geojson';
            styleOptions = {
                attribute: 'estimasi', 
                colorScale: chroma.scale('YlOrBr').domain([167912, 1416940]),
                fillColor: '#8c510a', 
                fillOpacity: 0.7
            };
            break;
        case 'fasilitasUmum':
            geojsonUrl = 'geojson/fasum.geojson';
            break;
        case 'bufferSungai':
            geojsonUrl = 'geojson/bufferSungai.geojson';
            styleOptions = {
                attribute: 'distance', 
                colorScale: chroma.scale(['lightblue', 'darkblue']).domain([0, 1000]), 
                fillColor: '#2c8bc7', 
                fillOpacity: 0.7
            };
            break;
        case 'bufferJalanArteri':
        case 'bufferKantorPemerintahan':
        case 'bufferFasilitasKesehatan':
        case 'bufferSaranaIbadah':
        case 'bufferPasar':
        case 'bufferSekolah':
        case 'bufferMakam':
            geojsonUrl = 'geojson/' + layerName + '.geojson';
            styleOptions = {
                attribute: 'distance', 
                colorScale: chroma.scale('OrRd').domain([0, 1000]), 
                fillColor: '#d73027', 
                fillOpacity: 0.7
            };
            break;
        default:
            console.error('Invalid layer name:', layerName);
            return;
    }

    var isChecked = document.getElementById(layerName + 'Checkbox').checked;

    if (isChecked) {
        fetch(geojsonUrl)
            .then(response => response.json())
            .then(data => {
                layer = L.geoJSON(data, {
                    style: function(feature) {
                        if (styleOptions.attribute) {
                            var value = feature.properties[styleOptions.attribute];
                            var color = styleOptions.colorScale(value).hex();
                            return {
                                color: '#000',
                                weight: 1,
                                fillColor: color || styleOptions.fillColor,
                                fillOpacity: styleOptions.fillOpacity
                            };
                        } else {
                            return {};
                        }
                    },
                    onEachFeature: function(feature, layer) {
                        if (layerName === 'estimasiNJOP') {
                            var formattedEstimasi = numberWithCommas(feature.properties.estimasi);
                            // Tambahkan popup dengan nilai estimasi yang diformat
                            var popupContent = "<b>Estimasi NJOP: </b>" + formattedEstimasi + "<br><b>Penggunaan Lahan: </b>" + feature.properties.REMARK;
                            layer.bindPopup(popupContent);
                        } else if (layerName === 'fasilitasUmum') {
                            var Keterangan = feature.properties.Keterangan;
                            var iconUrl = 'gambar/' + Keterangan + '.png';
                            layer.setIcon(L.icon({
                                iconUrl: iconUrl,
                                iconSize: [32, 32],
                                iconAnchor: [16, 32],
                                popupAnchor: [0, -30]
                            }));
                        }
                    }
                });
                layer.addTo(map);
                if (layerName === 'estimasiNJOP') {
                    createLegend(styleOptions.colorScale, 'Estimasi NJOP');
                }
                if (layerName === 'bufferJalanArteri') {
                    createLegend(styleOptions.colorScale, 'Buffer Jalan Arteri');
                }
                if (layerName === 'bufferKantorPemerintahan') {
                    createLegend(styleOptions.colorScale, 'Buffer Kantor Pemerintahan');
                }
                if (layerName === 'bufferFasilitasKesehatan') {
                    createLegend(styleOptions.colorScale, 'Buffer Fasilitas Kesehatan');
                }
                if (layerName === 'bufferSaranaIbadah') {
                    createLegend(styleOptions.colorScale, 'Buffer Sarana Ibadah');
                }
                if (layerName === 'bufferPasar') {
                    createLegend(styleOptions.colorScale, 'Buffer Pasar');
                }
                if (layerName === 'bufferSekolah') {
                    createLegend(styleOptions.colorScale, 'Buffer Sekolah');
                }
                if (layerName === 'bufferSungai') {
                    createLegend(styleOptions.colorScale, 'Buffer Sungai');
                }
                if (layerName === 'bufferMakam') {
                    createLegend(styleOptions.colorScale, 'Buffer Makam');
                }
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
            });
        } else {
            // Hapus layer GeoJSON dari peta jika checkbox tidak dicentang
            map.eachLayer(function(layer) {
                if (layer instanceof L.GeoJSON) {
                    map.removeLayer(layer);
                }
            });
            // Hapus legenda jika checkbox tidak dicentang
            var legend = document.querySelector('.legend');
            if (legend) {
                legend.remove();
            }
        }
    }
            

// Fungsi untuk membuat legenda otomatis
function createLegend(colorScale, title, attribute) {
    // Hapus legenda sebelumnya jika ada
    var legend = document.querySelector('.legend');
    if (legend) legend.remove();

    // Buat legenda baru
    var legendControl = L.control({ position: 'bottomleft' });

    legendControl.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>" + title + "</h4>";

        var domain = colorScale.domain();

        if (title === 'Estimasi NJOP') {
            var interval = (domain[1] - domain[0]) / 5;
            for (var i = 0; i < 5; i++) {
                var value = domain[0] + i * interval;
                var color = colorScale(value).hex();
                div.innerHTML += '<i style="background:' + color + '"></i><span>' + numberWithCommas(Math.round(value)) + ' - ' + numberWithCommas(Math.round(value + interval)) + '</span><br>';
            }

        } else if (title === 'Buffer Makam') {
            div.innerHTML += '<i style="background:#f9e1c1"></i><span>< 100 m</span><br>';
            div.innerHTML += '<i style="background:#a14745"></i><span>> 100 m</span><br>';
        } else if (title === 'Buffer Sungai') {
            div.innerHTML += '<i style="background:#b4cfe2"></i><span>< 100 m</span><br>';
            div.innerHTML += '<i style="background:#4747a8"></i><span>> 100 m</span><br>';
        } else if (title === 'Buffer Jalan Arteri') {
            div.innerHTML += '<i style="background:#f9e1c1"></i><span>< 50 m</span><br>';
            div.innerHTML += '<i style="background:#f6a881"></i><span>50 - 150 m</span><br>';
            div.innerHTML += '<i style="background:#d73027"></i><span>150 - 500 m</span><br>';
            div.innerHTML += '<i style="background:#a14745"></i><span>> 500 m</span><br>';
        } else {
            div.innerHTML += '<i style="background:#f9e1c1"></i><span>< 200 m</span><br>';
            div.innerHTML += '<i style="background:#f6a881"></i><span>200 - 500 m</span><br>';
            div.innerHTML += '<i style="background:#a14745"></i><span>> 500 m</span><br>';
        }

        return div;
    };
    // Tambahkan control legenda ke peta
    legendControl.addTo(map);

    // Tambahkan event listener untuk menghapus control legenda jika layer di-uncheck
    map.on('overlayremove', function(eventLayer) {
        if (eventLayer.name === title) {
            map.removeControl(legendControl);
        }
    });
}


function numberWithCommas(x) {
    return 'Rp' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
