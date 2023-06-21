import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInetrceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
        const Token = environment.token
        const Authorization = environment.Authorization
        const XAmzSecurityToken =  environment.XAmzSecurityToken
        const XAmzDate = environment.XAmzDate

        // request = request.clone({
        //     headers: request.headers
        //     .set('Token',  Token)
        //     .set('Authorization',  Authorization)
        //     .set('X-Amz-Security-Token',  XAmzSecurityToken)
        //     .set('X-Amz-Date',  XAmzDate)
        // });

        return next.handle(request);
    }
}