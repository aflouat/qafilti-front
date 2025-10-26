import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Reservation } from '../../core/services/reservations.service';

@Component({
  selector: 'app-ticket-print',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="ticket-container" *ngIf="reservation">
      <div class="ticket-header">
        <div class="ticket-logo">
          <h1>QAFILTI</h1>
          <p>TRANSPORT</p>
        </div>
        <div class="ticket-title-ar">
          <h1>قافلتي</h1>
          <p>النقل</p>
        </div>
      </div>

      <div class="ticket-subtitle">
        <span class="fr">Ticket de Réservation</span>
        <span class="ar">تذكرة الحجز</span>
      </div>

      <div class="ticket-divider"></div>

      <!-- Code de réservation -->
      <div class="ticket-row highlight">
        <div class="ticket-col-fr">
          <strong>Code:</strong> {{ reservation.code || reservation.reservationId }}
        </div>
        <div class="ticket-col-ar">
          <strong>الرمز:</strong> {{ reservation.code || reservation.reservationId }}
        </div>
      </div>

      <!-- Statut -->
      <div class="ticket-row status-row">
        <div class="ticket-col-fr">
          <strong>Statut:</strong>
          <span class="status-badge">{{ getStatus() }}</span>
        </div>
        <div class="ticket-col-ar">
          <strong>الحالة:</strong>
          <span class="status-badge">{{ getStatusAr() }}</span>
        </div>
      </div>

      <div class="ticket-divider"></div>

      <!-- Passager -->
      <div class="ticket-row">
        <div class="ticket-col-fr">
          <strong>Passager:</strong><br>
          {{ reservation.passengerName || reservation.passager }}
        </div>
        <div class="ticket-col-ar">
          <strong>المسافر:</strong><br>
          {{ reservation.passengerName || reservation.passager }}
        </div>
      </div>

      <!-- Téléphone -->
      <div class="ticket-row" *ngIf="reservation.passengerPhone">
        <div class="ticket-col-fr">
          <strong>Tél:</strong> {{ reservation.passengerPhone }}
        </div>
        <div class="ticket-col-ar">
          <strong>الهاتف:</strong> {{ reservation.passengerPhone }}
        </div>
      </div>

      <div class="ticket-divider-light"></div>

      <!-- Trajet -->
      <div class="ticket-row">
        <div class="ticket-col-fr">
          <strong>Trajet:</strong><br>
          {{ reservation.trajet }}
        </div>
        <div class="ticket-col-ar">
          <strong>الرحلة:</strong><br>
          {{ reservation.trajet }}
        </div>
      </div>

      <!-- Date -->
      <div class="ticket-row">
        <div class="ticket-col-fr">
          <strong>Date:</strong> {{ reservation.date | date:'dd/MM/yyyy' }}
        </div>
        <div class="ticket-col-ar">
          <strong>التاريخ:</strong> {{ reservation.date | date:'dd/MM/yyyy' }}
        </div>
      </div>

      <!-- Place -->
      <div class="ticket-row" *ngIf="reservation.seatNumber">
        <div class="ticket-col-fr">
          <strong>Place:</strong> {{ reservation.seatNumber }}
        </div>
        <div class="ticket-col-ar">
          <strong>المقعد:</strong> {{ reservation.seatNumber }}
        </div>
      </div>

      <div class="ticket-divider-light"></div>

      <!-- Montant -->
      <div class="ticket-row price-row">
        <div class="ticket-col-fr">
          <strong>Montant:</strong> {{ getAmount() }} MRU
        </div>
        <div class="ticket-col-ar">
          <strong>المبلغ:</strong> {{ getAmount() }} أوقية
        </div>
      </div>

      <div class="ticket-divider"></div>

      <!-- Footer -->
      <div class="ticket-footer">
        <div class="ticket-col-fr">
          <p>Merci de votre confiance</p>
          <p class="small">Bon voyage !</p>
        </div>
        <div class="ticket-col-ar">
          <p>شكرا لثقتكم</p>
          <p class="small">رحلة سعيدة!</p>
        </div>
      </div>

      <div class="ticket-info">
        <p>www.qafilti.com</p>
      </div>
    </div>
  `,
  styles: [`
    .ticket-container {
      width: 80mm;
      max-width: 80mm;
      margin: 0 auto;
      padding: 10mm;
      font-family: 'Arial', 'Segoe UI', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      background: white;
      color: #000;
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .ticket-logo h1,
    .ticket-title-ar h1 {
      font-size: 18pt;
      font-weight: bold;
      margin: 0;
      line-height: 1;
    }

    .ticket-logo p,
    .ticket-title-ar p {
      font-size: 9pt;
      margin: 2px 0 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .ticket-title-ar {
      text-align: right;
      direction: rtl;
    }

    .ticket-subtitle {
      display: flex;
      justify-content: space-between;
      font-size: 10pt;
      font-weight: bold;
      margin: 8px 0;
      text-align: center;
    }

    .ticket-subtitle .fr {
      flex: 1;
      text-align: left;
    }

    .ticket-subtitle .ar {
      flex: 1;
      text-align: right;
      direction: rtl;
    }

    .ticket-divider {
      border-top: 2px solid #000;
      margin: 8px 0;
    }

    .ticket-divider-light {
      border-top: 1px dashed #666;
      margin: 6px 0;
    }

    .ticket-row {
      display: flex;
      justify-content: space-between;
      margin: 6px 0;
      font-size: 10pt;
    }

    .ticket-col-fr {
      flex: 1;
      text-align: left;
      padding-right: 4px;
    }

    .ticket-col-ar {
      flex: 1;
      text-align: right;
      direction: rtl;
      padding-left: 4px;
    }

    .ticket-row.highlight {
      background: #f0f0f0;
      padding: 4px;
      border-radius: 3px;
      font-size: 11pt;
    }

    .ticket-row.status-row {
      margin: 6px 0;
    }

    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      background: #4CAF50;
      color: white;
      border-radius: 3px;
      font-size: 9pt;
      font-weight: bold;
    }

    .ticket-row.price-row {
      font-size: 12pt;
      font-weight: bold;
      background: #f9f9f9;
      padding: 6px 4px;
      border-radius: 3px;
    }

    .ticket-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 9pt;
      font-style: italic;
    }

    .ticket-footer p {
      margin: 2px 0;
    }

    .ticket-footer .small {
      font-size: 8pt;
    }

    .ticket-info {
      text-align: center;
      margin-top: 10px;
      font-size: 8pt;
      color: #666;
    }

    .ticket-info p {
      margin: 2px 0;
    }

    /* Styles pour l'impression */
    @media print {
      body * {
        visibility: hidden;
      }

      .ticket-container,
      .ticket-container * {
        visibility: visible;
      }

      .ticket-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 80mm;
        margin: 0;
        padding: 5mm;
      }

      @page {
        size: 80mm auto;
        margin: 0;
      }
    }
  `]
})
export class TicketPrintComponent {
  @Input() reservation?: Reservation;

  getStatus(): string {
    const status = this.reservation?.statut || this.reservation?.status;
    if (status === 'Confirmée' || status === 'CONFIRMED') return 'CONFIRMÉE';
    if (status === 'Brouillon' || status === 'PENDING') return 'BROUILLON';
    return status?.toString().toUpperCase() || 'N/A';
  }

  getStatusAr(): string {
    const status = this.reservation?.statut || this.reservation?.status;
    if (status === 'Confirmée' || status === 'CONFIRMED') return 'مؤكد';
    if (status === 'Brouillon' || status === 'PENDING') return 'مسودة';
    return 'غير محدد';
  }

  getAmount(): number {
    return this.reservation?.netAmount || this.reservation?.prix || 0;
  }
}
