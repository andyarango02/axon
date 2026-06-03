'use strict';

const PDFDocument = require('pdfkit');

// ── Layout constants (A4: 595 × 842 pt, margins 50pt) ────────
const ML = 50;       // margin left
const MR = 545;      // margin right (595 - 50)
const COL = {        // table columns (x = left edge)
  desc:  ML,
  qty:   250,
  price: 310,
  disc:  400,
  total: 455,
};
const ROW_H    = 22;
const GRAY     = '#6B7280';
const DARK     = '#111827';
const INDIGO   = '#4338CA';
const LINE_CLR = '#E5E7EB';

class QuotationPDFGenerator {
  generate(quotation, customer) {
    return new Promise((resolve, reject) => {
      const doc    = new PDFDocument({ size: 'A4', margin: 0 });
      const chunks = [];

      doc.on('data',  c => chunks.push(c));
      doc.on('end',   () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this._render(doc, quotation, customer);
      doc.end();
    });
  }

  _render(doc, q, customer) {
    let y = ML;

    // ── Header bar ───────────────────────────────────────────
    doc.rect(0, 0, 595, 70).fill(INDIGO);

    doc.fillColor('white').fontSize(20).font('Helvetica-Bold')
      .text('COTIZACIÓN', ML, 22, { width: 495, align: 'right' });

    doc.fontSize(11).font('Helvetica')
      .text('Axon', ML, 26);

    y = 90;

    // ── Reference / dates ────────────────────────────────────
    doc.fillColor(DARK).fontSize(9).font('Helvetica-Bold')
      .text('REFERENCIA', ML, y)
      .text('FECHA', 270, y)
      .text('VÁLIDO HASTA', 400, y);

    y += 13;
    doc.font('Helvetica').fillColor(GRAY)
      .text(q.id.slice(0, 18).toUpperCase(), ML, y, { width: 210 })
      .text(_fmtDate(q.createdAt), 270, y)
      .text(_fmtDate(q.validUntil), 400, y);

    y += 22;
    _hline(doc, y, LINE_CLR);
    y += 12;

    // ── Customer ─────────────────────────────────────────────
    doc.fillColor(DARK).fontSize(9).font('Helvetica-Bold')
      .text('CLIENTE', ML, y);

    y += 13;
    if (customer?.name) {
      doc.font('Helvetica').fillColor(GRAY)
        .text(customer.name, ML, y);
      y += 13;
    }
    doc.font('Helvetica').fillColor(GRAY)
      .text(`Teléfono: ${customer?.phone ?? '—'}`, ML, y);

    if (customer?.company) {
      y += 13;
      doc.text(`Empresa: ${customer.company}`, ML, y);
    }

    y += 22;
    _hline(doc, y, LINE_CLR);
    y += 14;

    // ── Items table header ───────────────────────────────────
    doc.fillColor(GRAY).fontSize(8).font('Helvetica-Bold');
    _tableRow(doc, y, {
      desc:  'DESCRIPCIÓN',
      qty:   'CANT.',
      price: 'P. UNITARIO',
      disc:  'DESC.',
      total: 'TOTAL',
    });

    y += ROW_H - 4;
    _hline(doc, y, '#D1D5DB');
    y += 8;

    // ── Items ────────────────────────────────────────────────
    doc.font('Helvetica').fontSize(9).fillColor(DARK);
    for (const item of q.items) {
      _tableRow(doc, y, {
        desc:  item.description,
        qty:   String(item.quantity),
        price: _fmtNum(item.unitPrice),
        disc:  item.discount > 0 ? `${item.discount}%` : '—',
        total: _fmtNum(item.total),
      });
      y += ROW_H;

      // page break guard (leave 200pt for totals)
      if (y > 620) {
        doc.addPage();
        y = ML;
      }
    }

    y += 4;
    _hline(doc, y, '#D1D5DB');
    y += 14;

    // ── Totals ────────────────────────────────────────────────
    const TOT_X   = 370;
    const VAL_X   = 470;
    const TOT_W   = VAL_X - TOT_X;

    const rows = [
      { label: 'Subtotal', value: _fmtNum(q.subtotal) },
      { label: 'Impuestos',value: _fmtNum(q.tax) },
    ];

    doc.fontSize(9).font('Helvetica').fillColor(GRAY);
    for (const r of rows) {
      doc.text(r.label, TOT_X, y, { width: TOT_W, align: 'right' })
         .text(r.value,  VAL_X, y, { width: MR - VAL_X, align: 'right' });
      y += 15;
    }

    _hline(doc, y, '#D1D5DB', TOT_X, MR);
    y += 8;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK)
      .text('TOTAL',      TOT_X, y, { width: TOT_W, align: 'right' })
      .text(_fmtNum(q.total), VAL_X, y, { width: MR - VAL_X, align: 'right' });

    y += 13;
    doc.fontSize(8).font('Helvetica').fillColor(GRAY)
      .text(`Moneda: ${q.currency}`, VAL_X, y, { width: MR - VAL_X, align: 'right' });

    // ── Notes ─────────────────────────────────────────────────
    if (q.notes) {
      y += 30;
      _hline(doc, y, LINE_CLR);
      y += 12;
      doc.fillColor(DARK).fontSize(8).font('Helvetica-Bold').text('NOTAS', ML, y);
      y += 12;
      doc.font('Helvetica').fillColor(GRAY).fontSize(8)
        .text(q.notes, ML, y, { width: 495 });
    }

    // ── Footer ────────────────────────────────────────────────
    doc.fontSize(7).fillColor('#9CA3AF').font('Helvetica')
      .text(
        `Documento generado el ${_fmtDate(new Date().toISOString())} · Ref: ${q.id}`,
        ML, 800, { width: 495, align: 'center' },
      );
  }
}

// ── Helpers ──────────────────────────────────────────────────

function _tableRow(doc, y, { desc, qty, price, disc, total }) {
  doc.text(desc,  COL.desc,  y, { width: COL.qty   - COL.desc  - 4 });
  doc.text(qty,   COL.qty,   y, { width: COL.price  - COL.qty   - 4, align: 'right' });
  doc.text(price, COL.price, y, { width: COL.disc   - COL.price - 4, align: 'right' });
  doc.text(disc,  COL.disc,  y, { width: COL.total  - COL.disc  - 4, align: 'right' });
  doc.text(total, COL.total, y, { width: MR         - COL.total,     align: 'right' });
}

function _hline(doc, y, color, x1 = ML, x2 = MR) {
  doc.moveTo(x1, y).lineTo(x2, y).strokeColor(color).lineWidth(0.5).stroke();
}

function _fmtNum(n) {
  return Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function _fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

module.exports = QuotationPDFGenerator;
