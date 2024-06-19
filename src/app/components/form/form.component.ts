import { Component } from '@angular/core';
import { ResponseService } from '../../services/response.service';
import { Response } from '../../models/response.model';
import { takeUntil  } from 'rxjs/operators';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { map } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

// I NEED TO HANDLE AUTRE AND JE NE SAIS PAS
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent {
  products?: Product[];
  selectedProducts?: Product[];
  responses?: Response[];
  correspondingProducts: Product[] = [];
  showProjectNameQuestion = false;
  projectName: string = '';
  showPreviousQuestion = true;
  showNextPage = false;
  selectedWidget: string = '';
  showProjectProducts = false;
  showStyle = false;
  showManufacture = false;
  showSegment = false;
  showType = false;
  showEspace = false;
  showSurface = false;
  showPose = false;
  showFinition = false;
  showMaterial = false;
  showHauteur = false;
  showForme = false;
  showResponse = false;
  showDetails = false;
  firstShow = true;
  selectedSegment: string = '';
  selectedStyle: string = '';
  selectedType: string = '';
  selectedEspaces: string[] = [];
  projectProducts = [];
  selectedEspace = { value : '', label : '', image : '', alt : '' };
  selectedSurface = {};
  selectedPose = {};
  selectedMaterial={};
  selectedHauteur = {};
  selectedForme = {};
  selectedFinition = {};
  filteredEspaces: { value: string, label: string, image: string, alt: string }[] = [];
private unsubscribe$: Subject<void> = new Subject<void>();


  formes: { value: string, label: string, image: string, alt: string }[] = [

    { value: 'Rond', label: 'Rond', image: 'assets/images/rond.png', alt: 'Image 1' },
    { value: 'Carré', label: 'Carré', image: 'assets/images/carre.png', alt: 'Image 2' },
    { value: 'Rectangulaire', label: 'Rectangulaire', image: 'assets/images/rectangulaire.svg', alt: 'Image 3' },
    { value: 'Linéaire', label: 'Linéaire', image: 'assets/images/ligne.png', alt: 'Image 4' },
    { value: ' ', label: 'Je ne sais pas', image: 'assets/images/jesaispas.jpg', alt: 'Image 4' },

  ];


  materials: { value: string, label: string, image: string, alt: string }[] = [

    { value: 'Bois', label: 'Bois', image: 'assets/images/bois.webp', alt: 'Image 1' },
    { value:'Brique', label: 'Brique', image: 'assets/images/brique.jpg', alt: 'Image 2' },
    { value: 'Placo', label: 'Plâtre', image: 'assets/images/platre.jpg', alt: 'Image 4' },
    { value: 'Gravier', label: 'Gravier', image: 'assets/images/gravier.jpg', alt: 'Image 5' },
    { value:'Beton', label: 'Béton', image: 'assets/images/beton.jpg', alt: 'Image 6' },
    { value:'Terre végétale', label: 'Terre végétale', image: 'assets/images/terre.jpg', alt: 'Image 7' },
  ];
  poses : { [segment: string]: { value: string, label: string, image: string, alt: string }[] } = {

    'Plafond': [
      { value: 'Suspendu', label: 'Suspendu', image: 'assets/images/suspendu.jpg', alt: 'Pose 2' },
      { value: 'Encastré', label: 'Encastré', image: 'assets/images/encastré.jpg', alt: 'Pose 1' },
      { value: 'En saillie', label: 'En saillie', image: 'assets/images/en_saillie.jpg', alt: 'Pose 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Pose 5' },
    ],
    'Mur': [
      { value: 'En saillie', label: 'En saillie', image: 'assets/images/saillie2.jpg', alt: 'Pose 2' },
      { value: 'Encastré', label: 'Encastré', image: 'assets/images/encastré2.jpg', alt: 'Pose 1' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Pose 5' },
    ],
    'Sol': [
      { value: 'Encastré', label: 'Encastré', image: 'assets/images/encastré3.jpg', alt: 'Pose 1' },
      { value: 'En saillie', label: 'En saillie', image: 'assets/images/en_saillie3.jpg', alt: 'Pose 2' },
      { value: 'Sur mat', label: 'Sur mât', image: 'assets/images/sur_mat.jpg', alt: 'Pose 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Pose 5' },
    ],

  };
  surfaces: { value: string, label: string, image: string, alt: string }[] = [
    { value: 'Mur', label: 'Mur', image: 'assets/images/mur.jpg', alt: 'Image 1' },
    { value: 'Plafond', label: 'Plafond', image: 'assets/images/plafond.jpg', alt: 'Image 2' },
    { value: 'Sol', label: 'Sol', image: 'assets/images/sol.jpg', alt: 'Image 3' },
    { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Image 4' },
  ];

  espaces: { value: string, label: string, image: string, alt: string }[] = [
    { value: 'Chambre', label: 'Chambre', image: 'assets/images/chambre.jpg', alt: 'Image 1' },
    { value: 'Salon / séjour', label: 'Salon / séjour', image: 'assets/images/salon.jpg', alt: 'Image 2' },
    { value: 'Cuisine', label: 'Cuisine', image: 'assets/images/cuisine.jpg', alt: 'Image 3' },
    { value: 'Salle de bain', label: 'Salle de bain', image: 'assets/images/salle_de_bain.jpg', alt: 'Image 4' },
    { value: 'Abords exterieur', label: 'Abords exterieur', image: 'assets/images/bandelerie.jpg', alt: 'Image 6' },
    { value: 'Couloir', label: 'Couloir', image: 'assets/images/couloir.jpg', alt: 'Image 6' },
    { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Image 3' },
  ];

  types: { [segment: string]: { value: string, label: string, image: string, alt: string }[] } = {
    'Résidentiel': [
      { value: 'Chateau', label: 'Chateau', image: 'assets/images/chateau.jpeg', alt: 'Type 1 Alt 1' },
      { value: 'Appartement', label: 'Appartement', image: 'assets/images/appartement.jpg', alt: 'Type 1 Alt 2' },
      { value: 'Chalet', label: 'Châlet en montagne', image: 'assets/images/chalet.jpg', alt: 'Type 1 Alt 2' },
      { value: 'Villa', label: 'Villa', image: 'assets/images/villa.jpg', alt: 'Type 1 Alt 2' },
      { value: 'Maison', label: 'Maison individuelle', image: 'assets/images/maison.jpg', alt: 'Type 1 Alt 3' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'tertaire': [
      { value: 'tour', label: 'Tour', image: 'assets/images/tour.jpg', alt: 'Type 1 Alt 1' },
      { value: 'siege', label: 'Siège social', image: 'assets/images/siege.jpg', alt: 'Type 1 Alt 2' },
      { value: 'agence', label: 'Agence', image: 'assets/images/agence.jpeg', alt: 'Type 1 Alt 2' },
      { value: 'administration', label: 'Administration', image: 'assets/images/administration.png', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'shop': [
      { value: 'centreC', label: 'Centre commercial', image: 'assets/images/centre.jpg', alt: 'Type 1 Alt 1' },
      { value: 'distribution', label: 'Grandes distribution', image: 'assets/images/distribution.jpg', alt: 'Type 1 Alt 2' },
      { value: 'boutique', label: 'Boutique et petit commerce', image: 'assets/images/boutique.jpg', alt: 'Type 1 Alt 2' },
      { value: 'grand', label: 'Grand magasin', image: 'assets/images/magasin.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'education': [
      { value: 'ecole', label: 'Ecole/collège/lycée', image: 'assets/images/ecole.jpg', alt: 'Type 1 Alt 1' },
      { value: 'campus', label: 'Campus universitaire', image: 'assets/images/campus.jpg', alt: 'Type 1 Alt 2' },
      { value: 'bibliotheque', label: 'Bibliothèque', image: 'assets/images/biblio.jpg', alt: 'Type 1 Alt 2' },
      { value: 'centreR', label: 'Centre de recherche', image: 'assets/images/centreR.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'hotellerie': [
      { value: 'hotel', label: 'Hôtel', image: 'assets/images/hotel.jpg', alt: 'Type 1 Alt 1' },
      { value: 'restaurant', label: 'Restaurant / Bar / Café', image: 'assets/images/restaurant.jpg', alt: 'Type 1 Alt 2' },
      { value: 'soin', label: 'Etablissement de soin', image: 'assets/images/soin.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'art': [
      { value: 'musee', label: 'Musée / Exposition', image: 'assets/images/musée.jpg', alt: 'Type 1 Alt 1' },
      { value: 'cinema', label: 'Cinéma / Théâtre', image: 'assets/images/cinema.jpg', alt: 'Type 1 Alt 2' },
      { value: 'monument', label: 'Monuments historiques', image: 'assets/images/monument.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'medical': [
      { value: 'hopital', label: 'Hôpital / clinique', image: 'assets/images/hopital.jpg', alt: 'Type 1 Alt 1' },
      { value: 'cabinet', label: 'Cabinet médical', image: 'assets/images/cabinet.jpg', alt: 'Type 1 Alt 2' },
      { value: 'pharmacie', label: 'Pharmacie', image: 'assets/images/pharmacie.jpeg', alt: 'Type 1 Alt 2' },
      { value: 'laboratoire', label: "Laboratoire d'analyse", image: 'assets/images/labo.jpg', alt: 'Type 1 Alt 2' },
      { value: 'centreSante', label: "Centres de santé / EHPAD", image: 'assets/images/ehpad.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'industriel': [
      { value: 'usine', label: 'Usine', image: 'assets/images/usine.jpg', alt: 'Type 1 Alt 1' },
      { value: 'entrepots', label: 'Entrepots logistiques', image: 'assets/images/entrepot.jpg', alt: 'Type 1 Alt 2' },
      { value: 'atelier', label: 'Ateliers', image: 'assets/images/atelier.jpg', alt: 'Type 1 Alt 2' },
      { value: 'locaux', label: "Locaux techniques", image: 'assets/images/locaux.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'parc': [
      { value: 'ecPublic', label: 'Eclairage public', image: 'assets/images/ec_public.jpg', alt: 'Type 1 Alt 1' },
      { value: 'parc', label: 'Parc & Jardin', image: 'assets/images/parcc.jpg', alt: 'Type 1 Alt 2' },
      { value: 'plPublic', label: 'Place publique', image: 'assets/images/publicc.jpg', alt: 'Type 1 Alt 2' },
      { value: 'parking', label: "Parking", image: 'assets/images/parking.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'infrastructure': [
      { value: 'aeroport', label: 'Aéroport', image: 'assets/images/aéro.jpg', alt: 'Type 1 Alt 1' },
      { value: 'tunnel', label: 'Tunnel', image: 'assets/images/tunnel.jpg', alt: 'Type 1 Alt 2' },
      { value: 'gare', label: 'Gare de train', image: 'assets/images/gare.jpg', alt: 'Type 1 Alt 2' },
      { value: 'port', label: "Port", image: 'assets/images/port.jpg', alt: 'Type 1 Alt 2' },
      { value: 'metro', label: "Metro", image: 'assets/images/metro.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
    'sportif': [
      { value: 'terrain', label: 'Terrain/Stade', image: 'assets/images/stade.jpg', alt: 'Type 1 Alt 1' },
      { value: 'piscine', label: 'Piscine', image: 'assets/images/piscine.jpg', alt: 'Type 1 Alt 2' },
      { value: 'gymnase', label: 'Gymnase', image: 'assets/images/gymnase.jpg', alt: 'Type 1 Alt 2' },
      { value: 'salle', label: "Salle de sport", image: 'assets/images/salle_sport.jpg', alt: 'Type 1 Alt 2' },
      { value: ' ', label: 'Je ne sais pas', image: 'assets/images/autre.jpg', alt: 'Type 1 Alt 2' },
    ],
  };
  currentSegments: { value: string, label: string, image: string, alt: string }[] = [
    { value: 'Résidentiel', label: 'Résidentiel', image: 'assets/images/résidentielle.jpg', alt: 'Image 1' },
    { value: 'education', label: 'Education', image: 'assets/images/education.jpg', alt: 'Image 2' },
    { value: 'tertaire', label: 'Tertiaire', image: 'assets/images/tertaire.jpg', alt: 'Image 3' },
    { value: 'hotellerie', label: 'Hôtellerie & bien être', image: 'assets/images/hotelerie.jpg', alt: 'Image 4' },
    { value: 'shop', label: 'Shop & retail', image: 'assets/images/shop&retail.jpg', alt: 'Image 5' },
    { value: 'art', label: 'Art & culture', image: 'assets/images/art.jpg', alt: 'Image 6' },
    { value: 'medical', label: 'Médical & centre de soins', image: 'assets/images/hopital.jpg', alt: 'Image 6' },
    { value: 'infrastructure', label: 'Infrastructures', image: 'assets/images/infrastructure.jpg', alt: 'Image 6' },
    { value: 'industriel', label: 'Locaux techniques et industriels', image: 'assets/images/industriel.jpg', alt: 'Image 6' },
    { value: 'sportif', label: 'Sportif', image: 'assets/images/sportif.jpg', alt: 'Image 6' },
    { value: 'parc', label: 'Parcs & milieux urbains', image: 'assets/images/parc.jpg', alt: 'Image 6' }

  ];

  selectedProduct: any;

  constructor(private productService: ProductService, private responseService: ResponseService,private router: Router, private projectService : ProjectService) { }
  selectWidget(standing: string) {
    this.selectedWidget = standing;
  }
  selectPose(espace, value) {
    this.selectedPose[espace] = value;
  }
  selectStyle(style: string) {
    this.selectedStyle = style;
  }

  selectType(type: string) {
    this.selectedType = type;
  }

  showDetailsP(product){
    this.showResponse = false;
    this.showDetails = true;
    this.selectedProduct = product;
  }

  selectEspace(value) {
    const index = this.selectedEspaces.indexOf(value);
    if (index > -1) {
      this.selectedEspaces.splice(index, 1);
      delete this.selectedSurface[value]; // Remove the surface selection if the space is deselected
      delete this.selectedPose[value]; // Remove the pose selection if the space is deselected
      delete this.selectedMaterial[value]; // Remove the material selection if the space is deselected
      delete this.selectedHauteur[value]; // Remove the material selection if the space is deselected
      delete this.selectedForme[value]; // Remove the material selection if the space is deselected
      delete this.selectedFinition[value]; // Remove the material selection if the space is deselected

    } else {
      this.selectedEspaces.push(value);
    }
  }



  selectHauteur(hauteur: number, espace: string) {
    this.selectedHauteur[espace] = hauteur;
  }
  selectForme(forme: string, espace: string) {
    this.selectedForme[espace] = forme;
  }
  selectFinition(finition: string, espace: string) {
    this.selectedFinition[espace] = finition;
  }


  selectSurface(espace, value) {
    this.selectedSurface[espace] = value;
  }
  selectMaterial(espace, value) {
    this.selectedMaterial[espace] = value;
  }
onFinitionClickButton(){
  this.showForme = false;
  this.showFinition = true;
}
onMaterialClickButton(){
  this.showPose = false;
  this.showMaterial = true;
}
onHauteurClickButton(){
  this.showMaterial = false;
  this.showHauteur = true;
}
onPoseButtonClick() {
this.showSurface = false;
this.showPose = true;
}
  selectSegment(segment: string) {
    this.selectedSegment = segment;
    this.showType = true;
    this.showSegment = false;
  }
  onNextButtonClick() {
    this.showNextPage= false;
    this.showProjectNameQuestion = true;
    this.showPreviousQuestion = false;
  }
  onNextButtonClick2() {
    if(this.selectedStyle!=null){
    this.showNextPage= false;
    this.showProjectNameQuestion = false;
    this.showPreviousQuestion = false;
    this.showStyle = true;
    }
  }
  goToHome(){
    this.router.navigate(['/accueil']);
  }
  onNextButtonClick1() {
    if(this.selectedWidget!=null){
    this.showNextPage= false;
    this.showProjectNameQuestion = false;
    this.showPreviousQuestion = false;
    this.showType = true;
    }
  }
  ongoBack(){
    this.showSegment = false;
    this.showType = false;
    this.showProjectNameQuestion = true;

  }
  onStandingButtonClick() {
  this.showStyle = false;
  this.showNextPage = true;
  }
  onSegmentButtonClick(){
    this.showSegment = true;
    this.showType = false;

  }
  onFormeButtonClick() {
   this.showForme = true;
    this.showHauteur = false;
    const inputElement = document.getElementById('input-h') as HTMLInputElement;
    if(inputElement != null) {
    if(inputElement.value.trim() != '') {
    this.selectedHauteur = parseInt(inputElement.value.trim());
    }}

  }
  onFinitionToForme(){
    this.showFinition = false;
    this.showForme = true;
  }
  onFormeToHauteur(){
    this.showForme = false;
    this.showHauteur = true;
  }
  onModeToSurface(){
    this.showPose = false;
    this.showSurface = true;
  }
  onMaterialToMode(){
    this.showMaterial = false;
    this.showPose = true;

  }
  onHauteurToMaterial(){
    this.showHauteur = false;
    this.showMaterial = true;
  }
  onSurfaceToEspace(){
    this.showSurface = false;
    if(this.selectedSegment === 'Résidentiel'){

    this.showEspace = true;}
    else{
      this.showNextPage = true;
    }
  }
  onEspaceToNext(){
    this.showEspace = false;
    this.showNextPage = true;
  }
  onStandingToStyle(){
    this.showNextPage = false;
    this.showStyle = true;
  }
  onStyleToType(){
    this.showStyle = false;
    this.showType = true;
  }
  onNextStepButtonClick() {
    const inputElement = document.getElementById('input') as HTMLInputElement;
    if(inputElement.value.trim() != '') {
    this.showProjectNameQuestion = false;
    this.showSegment = false;
    this.showSegment = true;
    this.showPreviousQuestion = false;
    this.projectName = inputElement.value.trim();
    }
  }
  onStyleButtonClick() {

    this.showStyle = true;
    this.showType = false;
  }
  onBackButtonClick() {
    this.showProjectNameQuestion = false;
    this.showPreviousQuestion = false;
    this.showNextPage=false;
    this.showPreviousQuestion = true;

  }
  onSurfaceButtonClick() {
    if (this.selectedEspaces.length > 0) {
      this.showEspace = false;
      this.showSurface = true;
    }
  }
  filterEspaces(): void {
    this.filteredEspaces = this.espaces.filter(espace => {
      return this.selectedEspaces.includes(espace.value);
    });
  }

  onEspaceButtonClick() {
    this.showNextPage = false;
    this.showHauteur = false;
    if(this.selectedSegment === 'Résidentiel'){
      this.showEspace= true;
    } else{
      this.showSurface = true;
    }
  }
  onWidgetHover(event: MouseEvent) {
    const widget = event.currentTarget as HTMLElement;
    widget.style.backgroundColor = 'blue'; // Changez la couleur ici
  }

  onWidgetLeave(event: MouseEvent) {
    const widget = event.currentTarget as HTMLElement;
    widget.style.backgroundColor = 'transparent'; // Retour à la couleur initiale
  }


  /*ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }*/
ngOnInit(): void {
  this.retrieveProducts();
  this.retrieveResponses();

}
lastEspac ="";
nextSpace(){

  let selectedEspac =  this.selectedEspaces[this.selectedEspaces.indexOf(this.selectedEspace.value) + 1];
  if(this.lastEspac === selectedEspac || selectedEspac==undefined){
    console.log(this.projectProducts);
    this.showProjectProducts = true;
    this.showResponse = false;
    this.projectProducts = Object.keys(this.projectProducts).map(key => {
      const product = this.projectProducts[key];
      product.Espace = key;
      return product;
    });
    const newProject: Project = {
      Nom: this.projectName,
      Products: this.projectProducts
    };

    this.projectService.addProject(newProject);

    console.log(this.projectProducts);
  }else{
  this.lastEspac = selectedEspac;
  console.log(selectedEspac)
  this.selectCurrentEspace(this.espaces.find(espace => espace.value === selectedEspac));
  }

}
returnToMenu(){
  this.router.navigate(['/accueil'])
}

showManu(){
  this.showProjectProducts = false;
  this.showManufacture =true;
}
send(product){
  this.firstShow = false;
  this.showResponse = true;
  this.showDetails = false;
  this.projectProducts[this.selectedEspace.label] = product;
}
selectCurrentEspace(value) {
  this.firstShow = true;
  this.showResponse = false;
  this.retrieveProducts();
  this.selectedEspace = value;
  let selectedResponses = this.responses.filter(response => {
    return (
      (this.selectedEspace.value === "" || response.Espace_a_traiter === this.selectedEspace.value)

    );
  });

  const casValues = selectedResponses.map(response => response.Combinaisons);

  // Filter products where Cas matches any of the Cas values in the responses
  this.selectedProducts = this.products.filter(product =>
  casValues.includes(product.Identifiant)
  );
  this.showResponse = true;

}


  getResults(): void {

    this.filterEspaces();
    this.selectedEspace = this.filteredEspaces[0];
    this.firstShow = true;
    this.showFinition =false;
this.showResponse = true;
let selectedResponses = this.responses.filter(response => {
  return (
    (this.selectedEspace.value === "" || response.Espace_a_traiter === this.selectedEspace.value)

  );
});

let casValues = Array.from(new Set(selectedResponses.flatMap(response => [response.Choix1, response.Choix2, response.Choix3])));

// Filter products where Cas matches any of the Cas values in the responses
this.selectedProducts = this.products.filter(product =>
casValues.includes(product.Identifiant)
);

}
retrieveProducts(): void {
  this.productService.getAll().snapshotChanges().pipe(
    map(changes =>
      changes.map(c =>
        ({  key: c.payload.key, ...c.payload.val() })
      )
    )
  ).subscribe(data => {
    this.products = data;
  });
}
retrieveResponses(): void {
  this.responseService.getAll().snapshotChanges().pipe(
    map(changes =>
      changes.map(c =>
        ({  key: c.payload.key, ...c.payload.val() })
      )
    )
  ).subscribe(data => {
    this.responses = data;
  });
}
goBack(){
  this.showDetails = false;
  this.showResponse = true;
}
}

