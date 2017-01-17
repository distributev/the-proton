import angular from 'angular';
import { Skin as SkinService } from './skin.service';

export default angular
    .module('theProtonApp.skin', [])
    .service('SkinService', SkinService)
    .name;