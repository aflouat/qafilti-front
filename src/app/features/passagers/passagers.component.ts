import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-passagers',
  imports: [TableModule, DialogModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './passagers.component.html',
  styleUrls: ['./passagers.component.css']
})
export class PassagersComponent {
  form: any = {};

  rows = [
    { id: 1, nom: 'Jean Dupont', telephone: '0601020304', document: 'CIN123456' },
    { id: 2, nom: 'Marie Curie', telephone: '0605060708', document: 'CIN654321' },
    { id: 3, nom: 'Ali Ben Ali', telephone: '0611121314', document: 'CIN112233' }
  ];
  filter = '';
  dialog = false;
   open() {
    this.form = {};
    this.dialog = true;
  }

  save() {
    if (this.form.id) {
      const index = this.rows.findIndex((r: any) => r.id === this.form.id);
      this.rows[index] = this.form;
    } else {
      this.form.id = this.rows.length ? Math.max(...this.rows.map((r: any) => r.id)) + 1 : 1;
      this.rows.push(this.form);
    }
    this.dialog = false;
    this.form = {};
  }
   }
