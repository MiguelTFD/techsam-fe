// callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `<div>Procesando autenticación...</div>`
})
export class CallbackComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

 ngOnInit() {
  this.route.queryParams.subscribe(params => {
    console.log('Parámetros recibidos en callback:', params);
    
    const code = params['code'];
    const state = params['state'];
    const error = params['error'];
    
    if (error) {
      console.error('OAuth error:', error);
      this.router.navigate(['/login'], { 
        queryParams: { error: error } 
      });
      return;
    }

    if (code && state) {
      console.log('Code recibido:', code);
      console.log('State recibido:', state);
      
      this.authService.handleAuthorizationCallback(code, state).subscribe({
        next: () => {
          console.log('Callback completado - redirigiendo a /');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Callback error:', err);
          console.error('Error details:', err.error, err.status, err.message);
          this.router.navigate(['/login'], { 
            queryParams: { error: 'callback_failed' } 
          });
        }
      });
    } else {
      console.error('Faltan code o state en los parámetros');
      this.router.navigate(['/login']);
    }
  });
}
}