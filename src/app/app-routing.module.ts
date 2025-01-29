import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { UxComponent } from './pages/ux/ux.component';
import { ArComponent } from './pages/ar/ar.component';
import { VideoComponent } from './pages/video/video.component';
import { UpdateComponent } from './pages/update/update.component';
import { PhotographyComponent } from './pages/photography/photography.component';
import { IllustrationComponent } from './pages/illustration/illustration.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { GraphicDesignComponent } from './pages/graphic-design/graphic-design.component';

const routes: Routes = [
  { path: 'home/:appt_id/:tenant_id', component: HomeComponent },
  // { path: 'admin/ux', component: UxComponent },
  { path: 'referrals/:appt_id/:tenant_id', component: ArComponent },
  // { path: 'admin/videos', component: VideoComponent },
  // { path: 'admin/updates', component: UpdateComponent },
  { path: 'multimedia/:appt_id/:tenant_id', component: PhotographyComponent },
  // { path: 'admin/illustration', component: IllustrationComponent },
  // { path: 'admin/documentation', component: DocumentationComponent },
  // { path: 'admin/graphic-design', component: GraphicDesignComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
