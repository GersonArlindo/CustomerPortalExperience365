import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';/* 
import { DashboardService } from '../dashboard.service'; */

@Component({
  selector: 'dashboard-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  /* constructor(private router: Router, private dashboard: DashboardService) {
    this.router.events.subscribe((event: Event) => {
      this.dashboard.setCurrentRoute(this.router.url);
      if (event instanceof NavigationEnd) {
        if (this.dashboard.sidebarOpen && window.innerWidth < 1024) {
          this.dashboard.closeSidebar();
        }
      }
    });
  } */

  ngOnInit(): void {
    // Establecer el atributo overflow en 'hidden' cuando el componente se monta
    document.documentElement.style.overflow = 'auto';

    this.initNavbar();
    this.initDarkMode();
  }

  private initNavbar(): void {
    const navbarMenu = document.getElementById("menu") as HTMLElement;
    const burgerMenu = document.getElementById("burger") as HTMLElement;
    const overlayMenu = document.querySelector(".overlay") as HTMLElement;

    // Abre y cierra el menú de navegación al hacer clic en el botón de hamburguesa
    if (burgerMenu && navbarMenu) {
      burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("is-active");
        navbarMenu.classList.toggle("is-active");
      });
    }

    // Cierra el menú de navegación al hacer clic en un enlace del menú
    document.querySelectorAll(".menu-link").forEach((link) => {
      link.addEventListener("click", () => {
        burgerMenu.classList.remove("is-active");
        navbarMenu.classList.remove("is-active");
      });
    });

    // Fija el menú de navegación en caso de redimensionamiento de ventana
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        if (navbarMenu.classList.contains("is-active")) {
          navbarMenu.classList.remove("is-active");
          overlayMenu.classList.remove("is-active");
        }
      }
    });
  }

  private initDarkMode(): void {
    const darkSwitch = document.getElementById("switch") as HTMLInputElement;

    // Verificar el estado del modo oscuro almacenado en localStorage
    if (localStorage.getItem("darkmode") === "enabled") {
      document.documentElement.classList.add("darkmode");
      document.body.classList.add("darkmode");
      darkSwitch.checked = true; // Si está activado, se marca el interruptor
    }

    // Agregar el evento para alternar el modo oscuro
    darkSwitch.addEventListener("click", () => {
      document.documentElement.classList.toggle("darkmode");
      document.body.classList.toggle("darkmode");

      // Guardar la preferencia en localStorage
      if (document.documentElement.classList.contains("darkmode")) {
        localStorage.setItem("darkmode", "enabled");
      } else {
        localStorage.setItem("darkmode", "disabled");
      }
    });
  }
}