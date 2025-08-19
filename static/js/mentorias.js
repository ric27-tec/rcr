function enviarFormulario(event) {
  event.preventDefault();

  const form = document.getElementById("charlasForm");
  const formData = new FormData(form);

  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const pais = formData.get("pais");

  const charlasSeleccionadas = [];
  form.querySelectorAll('input[name="charlas"]:checked').forEach(cb => {
    charlasSeleccionadas.push(cb.value);
  });

  const params = new URLSearchParams();
  params.append("nombre", nombre);
  params.append("email", email);
  params.append("pais", pais);
  params.append("charlas", charlasSeleccionadas.join(", ")); // 👈 clave

  fetch("https://script.google.com/macros/s/AKfycbwi3tHci6X2_Qw3k-7AhINlPrUcdGCIyASdhJuPEEBdy58B6w7a0xvD9KkPHwNtPTPU/exec", {
    method: "POST",
    body: params
  })
    .then(res => res.text())
    .then(result => {
      document.getElementById("mensaje").innerText = "¡Inscripción enviada con éxito!";
      form.reset();
    })
    .catch(error => {
      console.error("Error completo:", error);
      document.getElementById("mensaje").innerText = "Error al enviar el formulario.";
    });
}