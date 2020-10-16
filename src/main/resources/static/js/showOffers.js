import { addOffer, deleteOffer, getOffers, offerPriceById } from "./api.js";

function getCookieValue(a) {
  var b = document.cookie.match("(^|;)\\s*" + a + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

// response.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
// response.setHeader("Pragma","no-cache");
// response.setDateHeader("Expires", 0);

var myTable;

if (getCookieValue("msession") == "true") {
  $(document).ready(function () {
    BindItemTable();
    PopulateItemsTable();
    $(".dataTables_length").addClass("bs-select");
  });
} else {
  window.location.href = "http://localhost:8080/";
}

function BindItemTable() {
  myTable = $("#dtBasicExample").DataTable({
    deferRender: true,
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    sDom: "lfrtip",
  });
}

function PopulateItemsTable() {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/getoffers",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      console.log(response);
      // var jsonObject = JSON.stringify(response);
      var result = response.map(function (item) {
        var result = [];
        result.push(
          `<button value="${item.offerId}" onclick="deleteRow(this)"><i class="fa fa-trash pointer" aria-hidden="true"></i></button>`
        );
        // result.push(`<button onclick="deleteRow(this)" value="${item.offerId}">Click</button>`);
        result.push(
          `<button value="${item.offerId}" onclick="editRow(this)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>`
        );
        result.push(item.offerPlan);
        result.push(item.offerId);
        result.push(item.offerDesc);
        result.push(item.offerType);
        return result;
      });
      myTable.rows.add(result);
      myTable.draw();
    },
    failure: function () {
      $("#tblItems").append(
        " Error when fetching data please contact administrator"
      );
    },
  });
}

window.deleteRow = (item) => {
  console.log(item.value);
  if (confirm("Do you want to delete this offer")) {
    deleteOffer(item.value);
    window.location.reload();
  }
};

window.editRow = (item) => {
  console.log(item.value);
  document.cookie = "offerId=" + item.value;
  window.location.href = "UpdateOffer.html";
};

// function show(data) {
// 	$('#tableBody').empty();
//     data.forEach(row => {
//         $('#tableBody').append(`   <tr>
// 					                    <td onclick="hey()" class="pointer"><i class="fa fa-trash " aria-hidden="true"></i>
// 					                    </td>
// 					                    <td class="pointer"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></td>
// 					                    <td>${row.offerPlan}</td>
// 					                    <td>${row.offerId}</td>
// 					                    <td>${row.offerDesc}</td>
// 					                    <td>${row.offerType}</td>
// 					                    <td></td>
//                							</tr>`);
//     })

//   }
