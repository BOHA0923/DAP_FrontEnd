import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { setDefaultTimeoutInterval } from '../sharedTest/default_timeout.spec';
import { DwIamHttpErrorHandler } from './iam-http-error-handler';
import { Observable, of } from 'rxjs';

import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DwAuthService } from '../auth/auth.service';
import { DwHttpMessageService } from '@webdpt/framework/http';


describe('DwIamHttpErrorHandler', () => {
    let srv: DwIamHttpErrorHandler;
    let messageService: DwHttpMessageService;
    let authService: DwAuthService;
    let spyMessageServiceError: jasmine.Spy;
    let spyAuthServiceLogout: jasmine.Spy;
    setDefaultTimeoutInterval();
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DwIamHttpErrorHandler,
                {
                    provide: Router, useValue: {
                    },
                },
                Injector,
                // {
                //     provide: Injector, useValue: {
                //         get: (service: any): any => new service()
                //     },
                // },
                {
                    provide: DwHttpMessageService, useValue: {
                        error: (value: any): Observable<any> => {
                            return of(true);
                         }
                    },
                },
                {
                    provide: DwAuthService, useValue: {
                        logout: (): void => {

                        }
                    }
                }
            ]
        });
        srv = TestBed.get(DwIamHttpErrorHandler);
        messageService = TestBed.get(DwHttpMessageService);
        authService = TestBed.get(DwAuthService);
        spyMessageServiceError = spyOn(messageService, 'error').and.callThrough();
        spyAuthServiceLogout = spyOn(authService, 'logout').and.callThrough();
    });

    it('DwIamHttpErrorHandler should be created', () => {
        expect(srv).toBeTruthy();
    });
    describe('status:401', () => {
        it('DwIamHttpErrorHandler>>handlerError>> status:401 > error.code', () => {
            srv.handlerError(new HttpErrorResponse({ status: 401, error: { code: '411002', message: '產品授權問題' } }));
            expect(spyMessageServiceError).not.toHaveBeenCalled();
            // expect(spyMessageServiceError.calls.argsFor(0)[0]).toEqual('Invild token');
            expect(spyAuthServiceLogout).not.toHaveBeenCalled();
        });
        it('DwIamHttpErrorHandler>>handlerError>> status:401 沒有 error.code', () => {
            srv.handlerError(new HttpErrorResponse({ status: 401, error: { message: '其它問題' } }));
            expect(spyAuthServiceLogout).toHaveBeenCalled();
            expect(spyMessageServiceError).toHaveBeenCalled();
            expect(spyMessageServiceError.calls.argsFor(0)[0]).toEqual('其它問題');
        });
    });
    describe('非status:401', () => {
        it('DwIamHttpErrorHandler>>handlerError>> status:406 ', () => {
            srv.handlerError(new HttpErrorResponse({ status: 406, error: { message: '406問題' } }));
            expect(spyAuthServiceLogout).toHaveBeenCalled();
            expect(spyMessageServiceError).toHaveBeenCalled();
            expect(spyMessageServiceError.calls.argsFor(0)[0]).toEqual('406問題');
        });
        it('DwIamHttpErrorHandler>>handlerError>> status:500 ', () => {
            srv.handlerError(new HttpErrorResponse({ status: 500, error: { message: '500問題' } }));
            expect(spyAuthServiceLogout).not.toHaveBeenCalled();
            expect(spyMessageServiceError).toHaveBeenCalled();
            expect(spyMessageServiceError.calls.argsFor(0)[0]).toEqual('500問題');
        });
        it('DwIamHttpErrorHandler>>handlerError>> status:503 ', () => {
            srv.handlerError(new HttpErrorResponse({ status: 503, error: { message: '503問題' } }));
            expect(spyAuthServiceLogout).not.toHaveBeenCalled();
            expect(spyMessageServiceError).toHaveBeenCalled();
            expect(spyMessageServiceError.calls.argsFor(0)[0]).toEqual('503問題');
        });
    });


});
