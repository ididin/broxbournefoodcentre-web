import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOrderNotification = async (order: any, items: any[]) => {
    const notifyTo = process.env.EMAIL_NOTIFY_TO?.split(',') || [];

    if (notifyTo.length === 0) {
        console.warn('No notification emails configured.');
        return;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    };

    const itemsHtml = items.map((item) => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name || 'Product'} ${item.variantName ? `(${item.variantName})` : ''}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.price || item.priceAtBuy)}</td>
        </tr>
    `).join('');

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #047857; text-align: center;">YENİ SİPARİŞ GELDİ! 🎉</h2>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <h3 style="margin-top: 0; color: #111827;">Sipariş Özeti (#${order.orderNumber})</h3>
                <p><strong>Müşteri:</strong> ${order.guestEmail || 'Üye Müşteri'}</p>
                <p><strong>Teslimat Adresi:</strong> ${order.deliveryAddress}</p>
                <p><strong>Teslimat Zamanı:</strong> ${order.deliveryTimePref || 'Belirtilmedi'}</p>
                <p><strong>Ödeme Yöntemi:</strong> ${order.paymentMethod}</p>
                <p><strong>Toplam Tutar:</strong> ${formatCurrency(order.totalAmount)}</p>
            </div>

            <h3 style="color: #111827;">Sepet İçeriği</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                    <tr style="background-color: #f9fafb;">
                        <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Ürün</th>
                        <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Adet</th>
                        <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Birim Fiyat</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <p style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 32px;">
                Bu e-posta Broxbourne Food Centre web sitesinden otomatik olarak gönderilmiştir.
            </p>
        </div>
    `;

    try {
        const mailOptions = {
            from: \`"Broxbourne Web Sipariş" <\${process.env.EMAIL_USER}>\`,
            to: notifyTo.join(', '),
            subject: \`🚨 YENİ SİPARİŞ: #\${order.orderNumber} - \${formatCurrency(order.totalAmount)}\`,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order notification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending order notification email:', error);
        return { success: false, error };
    }
};
