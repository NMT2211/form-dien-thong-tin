const scriptURL = "https://script.google.com/macros/s/AKfycbyS_SAyUPLdtQ5qh8sNHETEGVGXprEG3eyZFaDhgTo2TFebE6eVgNnFqeIUv_7nMH8/exec";

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const response = document.getElementById("response");

  // Nút gửi: trạng thái loading
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.classList.add("opacity-80", "cursor-not-allowed", "scale-95");
  submitBtn.innerHTML = `
    <span class="flex items-center justify-center gap-2 animate-pulse">
      <i data-feather="loader" class="animate-spin"></i>
      <span>Đang gửi...</span>
    </span>`;
  feather.replace();

  // Tạo iframe ẩn
  const hiddenIframe = document.createElement("iframe");
  hiddenIframe.name = "hidden_iframe";
  hiddenIframe.style.display = "none";
  document.body.appendChild(hiddenIframe);

  form.target = "hidden_iframe";
  form.action = scriptURL;
  form.method = "POST";

  // Lấy dữ liệu từ form
  const formData = new FormData(form);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    system_type: formData.get('system_type'),
    power_usage: formData.get('power_usage') + ' kWh',
    message: formData.get('message'),
    newsletter: formData.get('newsletter') ? 'Có' : 'Không',
    timestamp: new Date().toLocaleString("vi-VN")
  };

  // Gắn payload JSON vào input ẩn
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "payload";
  hiddenInput.value = JSON.stringify(payload);
  form.appendChild(hiddenInput);

  // Gửi form
  form.submit();

  // 🎉 Hiển thị thông báo + thông tin tổng hợp
  response.innerHTML = `
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm animate-fadeIn text-left">
      <h2 class="text-green-700 text-lg font-semibold mb-2 flex items-center">
        <i data-feather="check-circle" class="mr-2"></i> Gửi thành công!
      </h2>
      <p class="text-green-700 mb-4">Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
      <div class="text-sm text-green-800 space-y-1">
        <p><strong>🧑 Họ tên:</strong> ${payload.name}</p>
        <p><strong>📧 Email:</strong> ${payload.email}</p>
        <p><strong>📱 Số điện thoại:</strong> ${payload.phone || "—"}</p>
        <p><strong>⚡ Loại hệ thống:</strong> ${payload.system_type || "Chưa chọn"}</p>
        <p><strong>🔋 Nhu cầu điện:</strong> ${payload.power_usage}</p>
        <p><strong>📝 Ghi chú:</strong> ${payload.message}</p>
        <p><strong>📬 Nhận bản tin:</strong> ${payload.newsletter}</p>
      </div>
    </div>
  `;
  response.classList.remove("hidden");
  response.classList.add("fade-in");

  form.reset();

  // Reset lại nút gửi sau 2 giây
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-80", "cursor-not-allowed", "scale-95");
    submitBtn.innerHTML = '<i data-feather="send" class="mr-2"></i> Gửi yêu cầu tư vấn';
    feather.replace();
  }, 2000);

  // Dọn dẹp input & iframe
  setTimeout(() => {
    hiddenInput.remove();
    hiddenIframe.remove();
  }, 3000);
});
