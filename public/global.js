const currentVersion = "v1.5.1";

function populateTextSectionContent() {
  //Will strip template html of html tags leaving inner content for the template text field
  const htmlString = window.codeMirrorEditor.getValue().trim();
  const textContent = $(htmlString).not('style').text().replace(/\s\s+/g, ' ').trim();
  $('#templateText').val(textContent);
}

(async function () {
  const versionChecked = sessionStorage.getItem('versionChecked');
  if (!versionChecked) {
    await $.get(`https://api.github.com/repos/MattRuddick/aws-ses-template-manager/tags`, (response) => {
      try {
        const latestVersion = response[0].name;
        if (currentVersion !== latestVersion) {
          sessionStorage.setItem('versionOutdated', 'true');
          sessionStorage.setItem('latestVersion', latestVersion);
        }
      } catch {
        console.warn('App version could not be checked.');
      }
    }).always(() => {
      // still mark versionCheck as done even if request failed. failsafe should the repo/url/git endpoint structure change in the future
      sessionStorage.setItem('versionChecked', 'true'); // indicates we have already checked the version
    });
  }

  $(document).ready(function () {
    if (sessionStorage.getItem('versionOutdated')) {
      const latestVersion = sessionStorage.getItem('latestVersion');
      $('body').append(`
        <a id="newVersionIndicator" href="https://github.com/MattRuddick/aws-ses-template-manager/releases/tag/${latestVersion}" target="_blank" data-toggle="tooltip" data-placement="bottom" data-html="true" title="<code>git pull</code> for latest version">
          New Version Available
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-download position-absolute" viewBox="0 0 16 16">
            <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
            <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/>
          </svg>
        </a>
      `);
      $('[data-toggle="tooltip"]').tooltip();
    }
  });
})();
