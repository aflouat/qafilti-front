import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PassagersService, Passager } from '../../core/services/passagers.service';

@Component({
  standalone: true,
  selector: 'app-passagers',
  imports: [TableModule, DialogModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './passagers.component.html',
  styleUrls: ['./passagers.component.css']
})
export class PassagersComponent {
  private readonly passagersService = inject(PassagersService);

  // Use service signals directly in the template
  readonly passagers = this.passagersService.passagers;

  form: Partial<Passager> = {};
  filter = '';
  dialog = false;
  currentId: number | null = null;

  open() {
    this.form = {};
    this.currentId = null;
    this.dialog = true;
  }

  edit(passager: Passager) {
    this.form = { ...passager };
    this.currentId = passager.id;
    this.dialog = true;
  }

  save() {
    if (this.currentId) {
      // Update existing
      this.passagersService.update(this.currentId, this.form);
    } else {
      // Create new
      if (this.form.nom && this.form.telephone) {
        this.passagersService.create({
          nom: this.form.nom,
          telephone: this.form.telephone
        });
      }
    }
    this.dialog = false;
    this.form = {};
    this.currentId = null;
  }

  remove(passager: Passager) {
    this.passagersService.delete(passager.id);
  }
}
