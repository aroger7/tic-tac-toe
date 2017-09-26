import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MessageService<T> {
	private _subject: Subject<T> = new Subject<T>();

	constructor() { }

	public get(): Observable<T> {
		return this._subject.asObservable();
	}

	public send(message: T): void {
		this._subject.next(message);
	}
}
