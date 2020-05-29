import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, MonoTypeOperatorFunction } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    
    
    constructor(private _auth: AuthService) { }

    
    // ? Interceptor de token de autenticación
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token: string = localStorage.getItem('tokenId')

        let request = req;

        if (token) {
            
            req.clone({
                setHeaders: {
                    authorization: `Bearer ${token}`
                }
            })
        }

        

        //? Capturar el evento o error
        return next.handle(req).pipe(tap(
            
            
            // * Muestra el evento
            (next: HttpEvent<any>) => {
                if (next instanceof HttpResponse) { console.log(event) }
            },
            
                    
                // ! Muestra el error
            (err: any) => { 
                if (err instanceof HttpErrorResponse) { console.warn(err) }
            },


            ),
        )
    }
}