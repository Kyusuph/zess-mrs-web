import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor() {

    }

    makeId(): string {
        let text = '';
        const first_letter_possible_combinations =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const possible_combinations =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 11; i++) {
            if (i === 0) {
                text += first_letter_possible_combinations.charAt(
                    Math.floor(Math.random() * first_letter_possible_combinations.length)
                );
            } else {
                text += possible_combinations.charAt(
                    Math.floor(Math.random() * possible_combinations.length)
                );
            }
        }
        return text;
    }
}