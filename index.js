let vehicles = [];
setListVehicle();

function layoutListVehicle() {
  $(".table-vehicle").html(`
        <thead>
          <tr class="table-primary">
            <th scope="col">No</th>
            <th scope="col">No Registrasi</th>
            <th scope="col">Nama Pemilik</th>
            <th scope="col">Merk Kendaraan</th>
            <th scope="col">Tahun Pembuatan</th>
            <th scope="col">Kapasitas</th>
            <th scope="col">warna</th>
            <th scope="col">Bahan Bakar</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
        ${vehicles.map((vehicle, index) => {
          return `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>${vehicle.registrationNumber}</td>
            <td>${vehicle.ownerName}</td>
            <td>${vehicle.vehicleMerk}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.cylinderCapacity}</td>
            <td style="background-color: ${vehicle.color}" >${vehicle.color}</td>
            <td>${vehicle.fuelType}</td>
            <td>
              <span  class="text-warning btn p-0 detail-vehicle" data-bs-toggle="modal" data-bs-target="#staticBackdrop" registrationsNumber="${
                vehicle.registrationNumber
              }">detail</span>
              <span  class="text-primary btn p-0 edit-vehicle" data-bs-toggle="modal" data-bs-target="#staticBackdrop" registrationsNumber="${
                vehicle.registrationNumber
              }">Edit</span>
              <span  class="text-danger delete-vehicle btn p-0" registrationsNumber="${vehicle.registrationNumber}" >delete</span>
              </td>
          </tr>
          `;
        })}
        </tbody>
     `);
}

function setListVehicle() {
  $.ajax("http://localhost:8080/api/vehicle").done(function (data) {
    vehicles = data;
    layoutListVehicle();
  });
}

$(".button-modal").on("click", () => {
  $(".saved-modal").removeClass("d-none");
  $(".modal-title").text("Tambah-Kendaraan");
  $(".saved-modal").text("Simpan");
  $(".saved-modal").removeClass("bg-warning");
  $(".saved-modal").addClass("bg-primary");
});

$("form").on("submit", function (event, ui) {
  event.preventDefault();
  const registrationNumber = $("#registrationNumber").val();
  const ownerName = $("#ownerName").val();
  const address = $("#address").val();
  const vehicleMerk = $("#vehicleMerk").val();
  const cylinderCapacity = $("#capacityCylinder").val();
  const vehicleColor = $("#vehicleColor").val();
  const year = $("#year").val();
  const fuelType = $("#fuelType").val();

  $.ajax({
    url: "http://localhost:8080/api/vehicle",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      registrationNumber,
      address,
      year: parseInt(year),
      cylinderCapacity: parseInt(cylinderCapacity),
      fuelType,
      vehicleMerk,
      color: vehicleColor,
      ownerName,
    }),
    success: function (response) {
      $("input").val("");
      $("select").val("");
      $("textArea").val("");
      setListVehicle();
      alert("Data berhasil disimpan");
    },
    error: function (xhr, status, error) {
      console.log(error);
      alert("gagal menyimpan data");
    },
  });
});

function setFilterVehicle(registrationNumber, ownerName) {
  if (registrationNumber == "") registrationNumber = null;
  if (ownerName == "") ownerName = null;
  vehicles = vehicles.filter((vehicle) => {
    return vehicle.registrationNumber.includes(registrationNumber) || vehicle.ownerName.includes(ownerName);
  });
  layoutListVehicle();
}

$(".search-vehicle").on("click", () => {
  const registrationNumber = $("#registration-number").val();
  const ownerName = $("#owner-name").val();

  setFilterVehicle(registrationNumber, ownerName);
  $(".reset-vehicle").removeClass("visually-hidden");
});

$(".reset-vehicle").on("click", () => {
  $(".reset-vehicle").addClass("visually-hidden");
  $("#registration-number").val("");
  $("#owner-name").val("");
  setListVehicle();
});

$("body").on("click", (event) => {
  if (event.target.classList.contains("delete-vehicle")) {
    const registrationNumber = event.target.getAttribute("registrationsNumber");
    const confirmDelete = confirm(`Are you sure you want to delete data from ${registrationNumber} `);

    if (confirmDelete) {
      $.ajax({
        url: `http://localhost:8080/api/vehicle/${registrationNumber}`,
        method: "DELETE",
        success: function (response) {
          setListVehicle();
          alert("Data berhasil dihapus");
        },
        error: function (xhr, status, error) {
          alert("gagal menghapus data");
        },
      });
    }
  }

  if (event.target.classList.contains("edit-vehicle")) {
    const registrationNumber = event.target.getAttribute("registrationsNumber");
    $.ajax({
      url: `http://localhost:8080/api/vehicle/${registrationNumber}`,
      method: "GET",
      success: function (response) {
        setEditFormVehicle(response);
      },
    });
  }

  if (event.target.classList.contains("detail-vehicle")) {
    const registrationNumber = event.target.getAttribute("registrationsNumber");
    $.ajax({
      url: `http://localhost:8080/api/vehicle/${registrationNumber}`,
      method: "GET",
      success: function (response) {
        setDetailForm(response);
      },
    });
  }
});

function setDetailForm(vehicle) {
  $("#registrationNumber").val(vehicle.registrationNumber).attr("disabled", true);
  $("#ownerName").val(vehicle.ownerName).attr("disabled", true);
  $("#address").val(vehicle.address).attr("disabled", true);
  $("#vehicleMerk").val(vehicle.vehicleMerk).attr("disabled", true);
  $("#capacityCylinder").val(vehicle.cylinderCapacity).attr("disabled", true);
  $("#vehicleColor").val(vehicle.color).attr("disabled", true);
  $("#year").val(vehicle.year).attr("disabled", true);
  $("#fuelType").val(vehicle.fuelType).attr("disabled", true);
  $(".modal-title").text("Detail-Kendaraan");

  $(".saved-modal").addClass("d-none");
}

function setEditFormVehicle(vehicle) {
  $("#registrationNumber").val(vehicle.registrationNumber).attr("disabled", true);
  $("#ownerName").val(vehicle.ownerName);
  $("#address").val(vehicle.address);
  $("#vehicleMerk").val(vehicle.vehicleMerk);
  $("#capacityCylinder").val(vehicle.cylinderCapacity);
  $("#vehicleColor").val(vehicle.color);
  $("#year").val(vehicle.year);
  $("#fuelType").val(vehicle.fuelType);

  $(".modal-title").text("Edit-Kendaraan");

  $(".saved-modal").removeClass("d-none");
  $(".saved-modal").text("Update");
  $(".saved-modal").removeClass("bg-primary");
  $(".saved-modal").addClass("bg-warning");
}
