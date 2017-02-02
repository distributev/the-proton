import angular from 'angular';
import { WellKnownServicesModalComponent } from './well-known-services-modal.component';
// import './well-known-services-modal.less';

export default angular
    .module('theProtonApp.wellKnownServicesModal', [])
    .component('wellKnownServicesModal', WellKnownServicesModalComponent)
    .name;