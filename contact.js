(function() {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = 'お問い合わせ | 東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = '東京農工大学将棋部へのお問い合わせ。フォームまたはX(旧Twitter)のDMからご連絡ください。';

  const h1 = document.createElement('h1');
  h1.textContent = 'お問い合わせ';
  c.appendChild(h1);

  const lead = document.createElement('p');
  lead.innerHTML = '将棋部に関するお問い合わせは、以下のフォームからお願いします。<br>お急ぎの場合は X(旧Twitter) の DM でも受け付けています。';
  c.appendChild(lead);

  const form = document.createElement('form');
  form.className = 'contact-form';
  form.id = 'contact-form';

  function createField(labelText, inputId, inputType, required, placeholder) {
    const div = document.createElement('div');
    div.className = 'contact-form-field';

    const label = document.createElement('label');
    label.setAttribute('for', inputId);
    label.innerHTML = labelText + (required ? ' <span aria-label="必須">*</span>' : '');

    let input;
    if (inputType === 'textarea') {
      input = document.createElement('textarea');
      input.id = inputId;
      input.name = inputId.replace('contact-', '');
    } else {
      input = document.createElement('input');
      input.type = inputType;
      input.id = inputId;
      input.name = inputId.replace('contact-', '');
    }
    if (required) input.required = true;
    if (placeholder) input.placeholder = placeholder;

    div.appendChild(label);
    div.appendChild(input);
    return div;
  }

  form.appendChild(createField('氏名', 'contact-name', 'text', true));
  form.appendChild(createField('メールアドレス', 'contact-email', 'email', true));

  var fieldset = document.createElement('fieldset');
  fieldset.className = 'contact-form-field';
  var legend = document.createElement('legend');
  legend.textContent = '学内の方のみ（任意）';
  fieldset.appendChild(legend);

  var inline = document.createElement('div');
  inline.className = 'contact-form-inline';

  var deptGroup = document.createElement('div');
  var deptLabel = document.createElement('label');
  deptLabel.setAttribute('for', 'contact-dept');
  deptLabel.textContent = '学部';
  var deptInput = document.createElement('input');
  deptInput.type = 'text';
  deptInput.id = 'contact-dept';
  deptInput.name = 'department';
  deptGroup.appendChild(deptLabel);
  deptGroup.appendChild(deptInput);

  var majorGroup = document.createElement('div');
  var majorLabel = document.createElement('label');
  majorLabel.setAttribute('for', 'contact-major');
  majorLabel.textContent = '学科';
  var majorInput = document.createElement('input');
  majorInput.type = 'text';
  majorInput.id = 'contact-major';
  majorInput.name = 'major';
  majorGroup.appendChild(majorLabel);
  majorGroup.appendChild(majorInput);

  var gradeGroup = document.createElement('div');
  var gradeLabel = document.createElement('label');
  gradeLabel.setAttribute('for', 'contact-grade');
  gradeLabel.textContent = '学年';
  var gradeInput = document.createElement('input');
  gradeInput.type = 'text';
  gradeInput.id = 'contact-grade';
  gradeInput.name = 'grade';
  gradeGroup.appendChild(gradeLabel);
  gradeGroup.appendChild(gradeInput);

  inline.appendChild(deptGroup);
  inline.appendChild(majorGroup);
  inline.appendChild(gradeGroup);
  fieldset.appendChild(inline);
  form.appendChild(fieldset);

  form.appendChild(createField('件名', 'contact-subject', 'text', true));
  form.appendChild(createField('メッセージ', 'contact-message', 'textarea', true));

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = '送信（メールクライアント起動）';
  form.appendChild(submitBtn);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const f = this.elements;
    let body = '\u540F\u540D: ' + f.name.value + '\n\u30E1\u30FC\u30EB: ' + f.email.value;
    if (f.department.value || f.major.value || f.grade.value) {
      body += '\n\u5B66\u90E8: ' + f.department.value + '\n\u5B66\u79D1: ' + f.major.value + '\n\u5B66\u5E74: ' + f.grade.value;
    }
    body += '\n\n' + f.message.value;
    const mailto = 'mailto:tuatshogi@gmail.com?subject=' + encodeURIComponent(f.subject.value) + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
  });

  c.appendChild(form);
})();
