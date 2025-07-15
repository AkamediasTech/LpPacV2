document.addEventListener('DOMContentLoaded', function () {
    const nextBtn = document.getElementById('nextBtn');
    const form = document.getElementById('form');
    let currentStep = 0;
    const inputs = form.querySelectorAll('.input-container');
    const answers = {}; // Stocke les réponses des étapes avec des boutons
    const containerCricle = document.querySelector('.containerCricle');
    let loaderCounter = 0;
    let buttonTextCounter = 0;
    let displayStepCounter = 1;
    let ville = "";
    let type_bien = "";
    let vous_etes = "";
    let _aidesOrTravaux = "";


    const messagesHeader = [
        { text: 'Vous étes éligible à Maprime renov', color: 'green', time: randomDelay() },
        { text: 'Nous vous contacterons sous 24 h', color: '#1264c1', time: 4000 }
    ];
    let currentIndexHeader = 0;

    const buttonTextTab = [
        "",
        "",
        "Obtenir mon estimation"
    ];
    

    // Création du message de validation (caché au départ)
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.innerHTML = `
        <div class="checkmark-animation">
            <img src="assets/validate.svg" alt="Validation" class="checkmark fixedheight">
        </div>
        <p>Votre formulaire a été soumis avec succès !</p>
    `;
    successMessage.style.display = 'none';
    form.appendChild(successMessage);

    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.innerHTML = `
        <div class="checkmark-animation">
            <img src="assets/error.svg" alt="error" class="checkmark fixedheight">
        </div>
        <p>Erreur lors de l'envoi du formulaire</p>
    `;
    errorMessage.style.display = 'none';
    form.appendChild(errorMessage);

    // Gestion des boutons cliquables
    const optionButtons = form.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            displayStep();
            buttonText();
            const value = button.dataset.value;
            const step = button.dataset.step;
            answers[`step${step}`] = value;
            inputs[currentStep].classList.remove('active');
            currentStep++;
            console.log("count:", currentStep);
            if (currentStep === 6){
                showLoaderAndNextStep();
                toggleBannerMessage();
            }else if (currentStep < inputs.length) {

                if (currentStep === 2) {
                    type_bien = value;
                    console.log("type bien :", type_bien);
                }
                if (currentStep === 3) {
                    vous_etes = value;
                    console.log("vous etes :", vous_etes);
                }
                if (currentStep === 1) {
                    _aidesOrTravaux = value;
                    console.log("chemin :", _aidesOrTravaux);
                }

                inputs[currentStep].classList.add('active');
                toggleNextButtonVisibility();
            } else {
                showLoader();
                sendFormData();
            }
        });
    });

    // Gestion du bouton "Suivant"
    nextBtn.addEventListener('click', () => {
        if (validateCurrentStep()) {
            const isLastStep = currentStep >= inputs.length - 1;
            const shouldShowLoader = !(currentStep === 6);
            displayStep();
            aidesOrTravaux();
            buttonText();

            console.log("Étape actuelle:", currentStep);
    
            let delayDiv = 0; // Valeur par défaut
            if (shouldShowLoader) {
                showLoader();
                const delay = randomDelay();
                delayDiv = delay;
                setTimeout(() => {
                    nextText();
                    passToSucess();
                }, delay / 2);
            }
    
            setTimeout(() => {
                if (!isLastStep) {
                    inputs[currentStep].classList.remove('active');
                    currentStep++;
                    inputs[currentStep].classList.add('active');
                    toggleNextButtonVisibility();
                } else {
                    // showLoader();
                    sendFormData();
                    toggleBannerMessage();
                }
                if (shouldShowLoader) {
                    hideLoader();
                }
            }, delayDiv);
        }
    });
    

    function showLoaderAndNextStep() {
        showLoader();
        const delay = randomDelay(); 
        setTimeout(() => {
            nextText();
            passToSucess(); 
        }, delay / 2);
        setTimeout(() => {
            hideLoader(); 
            if (currentStep < inputs.length) {
                inputs[currentStep].classList.add('active');
                toggleNextButtonVisibility();
            } else {
                sendFormData();
                console.log(delay,"ms");
            }
        }, delay);
    }   

    function showLoader() {
        const loaderContainer = document.getElementById('loader-container'); 
        const msg_loader = document.getElementById('msg_loader'); 
        const form = document.getElementById('form'); 

        document.querySelectorAll('.active').forEach(el => {
            el.style.display = 'none';
            el.style.opacity = '0';
        });
        nextBtn.style.display = 'none';
        
        loaderContainer.style.display = 'flex';
        msg_loader.style.display = 'flex';
        nextText();
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            loaderContainer.style.opacity = '1';
        }, 50);   
    }

    function hideLoader() {
        const loaderContainer = document.getElementById('loader-container'); 
        const msg_loader = document.getElementById('msg_loader'); 
        const form = document.getElementById('form'); 

        msg_loader.style.display = 'none';
        loaderContainer.style.opacity = '0';

        nextText();
        passToSucessNone();

        setTimeout(() => {
            loaderContainer.style.display = 'none';
            document.body.style.overflow = "auto";

            document.querySelectorAll('.active').forEach(el => {
            el.style.display = 'true';
            el.style.opacity = '1';
            });
        }, 200);
    }

    function passToSucess() {
        const loaderContainer = document.getElementById('loader-container');
        const okCircleFilled = document.getElementById('ok-circle-filled'); 
        loaderContainer.style.opacity = '0';
        loaderContainer.style.display = 'none';
        okCircleFilled.style.opacity = '1';
        okCircleFilled.style.display = 'flex';
        okCircleFilled.style.width = '100px';
        okCircleFilled.style.height = '100px';
    }

    function passToSucessNone() {
        const okCircleFilled = document.getElementById('ok-circle-filled'); 
        okCircleFilled.style.opacity = '0';
        okCircleFilled.style.display = 'none';
        okCircleFilled.style.width = '0px';
        okCircleFilled.style.height = '0px';
    }

    function nextText(){
        const loaderMessages = [
            "",
            "Recherche de vos aides régionales",
            `Bonne nouvelle ! ${ville} est éligible`, // Utilisation correcte des backticks
            "",
            "Calcul des aides MaPrimeRénov",
            "Votre logement est éligible à MaPrimeRénov’",
            "",
            "Envoi du formulaire en cours",
            "",
            ""
        ];
        
        const loaderText = document.getElementById('loader-text');
        loaderCounter ++;
        loaderText.textContent = loaderMessages[loaderCounter];
    }

    function buttonText(){
        const currentStepSync = currentStep + 1;
        if(currentStepSync === 0 || currentStepSync >= 4){
            buttonTextCounter ++;
            const buttonText = document.getElementById('nextBtn');
            buttonText.textContent = buttonTextTab[buttonTextCounter -1];
        }else{
            return
        }
    }

    function displayStep(){
        const currentStepSync = currentStep + 1;
        if(currentStepSync === 2 || currentStepSync === 6){
            setTimeout(() => {
                document.getElementById(`circle-${displayStepCounter}`)?.classList.remove('activeCircle');
                displayStepCounter++;
                document.getElementById(`circle-${displayStepCounter}`)?.classList.add('activeCircle');
            }, randomDelay());
        }else{
            return
        }

    }

    function validateCurrentStep() {
        const currentInput = inputs[currentStep];
        const inputsInStep = currentInput.querySelectorAll('input');
        let isValid = true;

        const errorMessages = currentInput.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        for (let input of inputsInStep) {
            if (input.required && !input.value.trim()) {
                showError(input, 'Ce champ est requis.');
                isValid = false;
            }

            if (input.id === 'codePostal' && !/^\d{5}$/.test(input.value.trim())) {
                showError(input, 'Le code postal doit être composé de 5 chiffres.');
                isValid = false;
            }

            if (input.type === 'email' && input.value && !input.checkValidity()) {
                showError(input, 'Veuillez entrer une adresse email valide.');
                isValid = false;
            }

            if (input.type === 'tel' && input.value && !input.checkValidity()) {
                showError(input, 'Veuillez entrer un numéro de téléphone valide.');
                isValid = false;
            }
            if (currentStep === 1) {
                ville = input.value;
                console.log("Ville enregistrée :", ville);
            }
            if (input.required) {
                if ((input.type === 'checkbox' || input.type === 'radio') && !input.checked) {
                    showError(input, 'Ce champ est requis.');
                    isValid = false;
                } else if (input.type !== 'checkbox' && input.type !== 'radio' && !input.value.trim()) {
                    showError(input, 'Ce champ est requis.');
                    isValid = false;
                }
            }

        }
        return isValid;
    }

    function showError(input, message) {
        console.log(`Ajout d'une erreur pour ${input.name}: ${message}`);

        // === Cas particulier : checkbox ===
        if (input.type === 'checkbox' && input.id === 'consent') {
            const errorSpan = document.getElementById('consent-error');
            if (errorSpan) {
                errorSpan.style.display = 'inline';
            }

            // Supprimer le message d'erreur quand on coche la case
            input.addEventListener('change', function clearCheckboxError() {
                if (input.checked && errorSpan) {
                    errorSpan.style.display = 'none';
                    input.removeEventListener('change', clearCheckboxError);
                }
            });

            return; // Ne pas exécuter le reste pour une checkbox
        }

        // === Pour les autres types de champs ===
        if (!input.dataset.placeholder) {
            input.dataset.placeholder = input.placeholder;
        }

        input.placeholder = message;
        input.classList.add('error-input');
        input.value = '';

        input.addEventListener('input', function restorePlaceholder() {
            input.placeholder = input.dataset.placeholder;
            input.classList.remove('error-input');
            input.removeEventListener('input', restorePlaceholder);
        });
    }


    function toggleNextButtonVisibility() {
        const isSelectionStep = inputs[currentStep].classList.contains('selection-step');
        nextBtn.style.display = isSelectionStep ? 'none' : 'block';
    }



    async function simulateChecklist(containerId) {
        const steps = [
            "Vérification du code postal",
            "Vérification du profil client",
            "Vérification des aides disponibles",
            "Vérification des installateurs",
            "Vérification des remises applicables"
        ];

        const container = document.getElementById(containerId);
        if (!container) return;

        // Injecter le style une seule fois
        const style = document.createElement('style');
        style.textContent = `
            .checklist-item-Js-annimation {
            display: flex;
            align-items: center;
            font-family: Arial, sans-serif;
            font-size: 18px;
            margin-bottom: 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
            }
            .loader-checklist {
            border: 3px solid #d3eaff;
            border-top: 3px solid #007bff;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            margin-right: 10px;
            }
            .check-Js-annimation {
            color: green;
            font-weight: bold;
            font-size: 21px;
            margin-right: 10px;
            }
            @keyframes spin {
            to { transform: rotate(360deg); }
            }

            #checklist-container-Js-annimation{
            display: flex;
            flex-direction: column;
            margin-top: 24px;
            }

            @media (max-width: 768px) {
                .checklist-item-Js-annimation {
                    font-size: 16px;
                    margin-bottom: 12px;
                }
            }
        `;
        document.head.appendChild(style);

        // Fonction utilitaire pour temporiser
        const wait = (ms) => new Promise((res) => setTimeout(res, ms));

        // Créer chaque étape séquentiellement
        for (const stepText of steps) {
            const item = document.createElement('div');
            item.className = 'checklist-item-Js-annimation';

            const loader = document.createElement('div');
            loader.className = 'loader-checklist';

            const text = document.createElement('span');
            text.textContent = stepText;

            item.appendChild(loader);
            item.appendChild(text);
            container.appendChild(item);

            // Déclenche l’apparition (fade-in)
            requestAnimationFrame(() => {
            item.style.opacity = 1;
            });

            // Attendre pendant le "chargement"
            await wait(700);

            // Remplacer le loader par un check
            const check = document.createElement('div');
            check.className = 'check-Js-annimation';
            check.textContent = '✔';
            loader.replaceWith(check);
            await wait(50);
        }
    }

    function toggleBannerMessage() {
        const bannerP = document.querySelector('.bannerMsg p');
        const banner = document.querySelector('.bannerMsg');
        if (!bannerP) return;
        const currentMessage = messagesHeader[currentIndexHeader];
        setTimeout(() => {
            bannerP.textContent = currentMessage.text;
            banner.style.backgroundColor = currentMessage.color;
        }, currentMessage.time);

        currentIndexHeader = (currentIndexHeader + 1) % messagesHeader.length;
    }

    
    function aidesOrTravaux() {
        const label = document.querySelector('label[for="nom"]');
        setTimeout(() => {
            if (_aidesOrTravaux === "Aides"){
                label.textContent = "Recevoir le detail de mes aides";
            }; if(_aidesOrTravaux === "Travaux"){
                label.textContent = "Recevoir mon devis travaux";
            }
        }, randomDelay());
    }

    async function getVilleFromCodePostal(codePostal) {
        try {
            const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom&format=json`);
            const data = await response.json();

            const datalist = document.getElementById("listeVilles");
            const villeInput = document.getElementById("Ville");

            // Réinitialiser les options
            datalist.innerHTML = "";

            if (data.length > 0) {
                data.forEach(ville => {
                    const option = document.createElement("option");
                    option.value = ville.nom;
                    datalist.appendChild(option);
                });

            villeInput.value = "";
            villeInput.placeholder = "Choisissez une ville";
            villeInput.focus();

            } else {
                villeInput.value = "";
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des villes :", error);
            document.getElementById("Ville").value = "";
        }
    }

    document.getElementById("codePostal").addEventListener("input", function () {
        const codePostal = this.value;

        if (/^\d{5}$/.test(codePostal)) {
            getVilleFromCodePostal(codePostal);
        } else {
            document.getElementById("Ville").value = "";
            document.getElementById("listeVilles").innerHTML = "";
        }
    });


    function sendFormData() {
        const formData = new FormData(form);
        Object.keys(answers).forEach(key => {
            formData.append(key, answers[key]);
        });

        fetch('https://techaka.app.n8n.cloud/webhook/09432390-e800-435f-8fc4-556500f618cf', { //cf
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Données envoyées:', data);
            finalizeForm();
            sendS2SPixelIfNeeded();
        })
        .catch(error => {
            console.error('Erreur:', error);
            finalizeFormError();
        });
    }

    function finalizeForm() {
        // setTimeout(() => {
            // hideLoader(); 
            simulateChecklist("checklist-container-Js-annimation");
            containerCricle.style.opacity = '0';
    
            inputs.forEach(input => input.style.opacity = '0');
            inputs.forEach(input => input.style.display = 'none');
            nextBtn.style.display = 'none';
            containerCricle.style.display = 'none';
            if (answers.step1 !== "Appartement" && answers.step2 !== "Locataire") {
                console.log("validation");
                fbq('track', 'Lead');
            }

            setTimeout(() => {
                const checklistContainer = document.getElementById('checklist-container-Js-annimation');
                checklistContainer.style.display = 'none';
                checklistContainer.style.opacity = '0';

                successMessage.style.display = 'flex';
                successMessage.style.opacity = '1';
                successMessage.style.marginTop = '48px';
                console.log(answers);
                // if (answers.step1 !== "Appartement" && answers.step2 !== "Locataire") {
                //     console.log("validation");
                //     fbq('track', 'Lead');
                // }
            }, 3750);
        // }, randomDelay());
    }
    
    function finalizeFormError() {
        // setTimeout(() => {
            // hideLoader(); 
            simulateChecklist("checklist-container-Js-annimation");
            containerCricle.style.opacity = '0';
    
            inputs.forEach(input => input.style.opacity = '0');
            inputs.forEach(input => input.style.display = 'none');
            nextBtn.style.display = 'none';
            containerCricle.style.display = 'none';

            setTimeout(() => {
                const checklistContainer = document.getElementById('checklist-container-Js-annimation');
                checklistContainer.style.display = 'none';
                checklistContainer.style.opacity = '0';
                    
                errorMessage.style.display = 'flex';
                errorMessage.style.opacity = '1';
                errorMessage.style.marginTop = '48px';
            }, 3750);

        // }, 0);
    }
    
    function sendS2SPixelIfNeeded() {
        const params = new URLSearchParams(window.location.search);
        const var_oc = params.get("var_oc");

        if (!var_oc) return; // Si pas de var_oc, on ne fait rien
        if (vous_etes === "Locataire") return;
        if (type_bien === "Appartement") return;

        fetch(`https://publisher.api.optincollect.com/s2s/lead.json?uid=auto&s2s=${encodeURIComponent(var_oc)}`)
            .then(res => {
            if (res.ok) {
                console.log("Pixel S2S envoyé avec succès.");
            } else {
                console.warn("Erreur lors de l'envoi du pixel S2S :", res.status);
            }
            })
            .catch(err => console.error("Erreur requête S2S :", err));
    }

    function randomDelay() {
        return 3000;
    }
    toggleNextButtonVisibility();
});
