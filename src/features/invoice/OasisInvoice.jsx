import emailjs from "@emailjs/browser";
import {
  Document,
  Image,
  Page,
  pdf,
  PDFDownloadLink,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

import Button from "../../ui/Button";
import Empty from "../../ui/Empty";
import Logo from "../../ui/Logo2";
import Spinner from "../../ui/Spinner";
import { formatCurrency } from "../../utils/helpers";
import { useInvoice } from "./useInvoice";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  sendEmailbutton: {
    display: "flex",
    margin: "5px 0 5px auto",
  },

  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    display: "flex",
    justifiContent: "center",
    alignItems: "center",
  },
  image: {
    width: 40, // Set image width
    height: 40, // Set image height
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    padding: 5,
    fontSize: 10,
  },

  footer: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 10,
  },
});

// Create the PDF document
const OasisInvoiceTemplate = ({ invoiceData }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.title}>
        <Image
          src="/logo-light-smallest.png" // Replace with your image URL or path
          style={styles.image}
        />
        <Text>Oasis Invoice</Text>
        <Text> </Text>
      </View>
      <View style={styles.section}>
        numNights: booking.numNights,
        <Text style={styles.text}>
          Guest Name: {invoiceData.guestName} / {invoiceData.numNights} nights
        </Text>
        <Text style={styles.text}>
          Check-in &nbsp;&nbsp;Date: {invoiceData.checkInDate}
        </Text>
        <Text style={styles.text}>
          Check-out Date: {invoiceData.checkOutDate}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Description</Text>
          <Text style={styles.tableCol}>Quantity</Text>
          <Text style={styles.tableCol}>Unit Price</Text>
          <Text style={styles.tableCol}>Amount</Text>
        </View>
        {invoiceData.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCol}>{item.description}</Text>
            <Text style={styles.tableCol}>{item.quantity}</Text>
            <Text style={styles.tableCol}>
              {formatCurrency(item.unitPrice)}
            </Text>
            <Text style={styles.tableCol}>{formatCurrency(item.amount)}</Text>
          </View>
        ))}
      </View>

      {invoiceData.restaurants.length > 0 && (
        <>
          <Text> </Text>
          <Text style={styles.tableCol}>Extra Charge</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Restaurant</Text>
              <Text style={styles.tableCol}>Charged Date</Text>
              <Text style={styles.tableCol}>Guests</Text>
              <Text style={styles.tableCol}>Amount</Text>
            </View>
            {invoiceData.restaurants.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{item.name}</Text>
                <Text style={styles.tableCol}>{item.createdAt}</Text>
                <Text style={styles.tableCol}>{item.guests}</Text>
                <Text style={styles.tableCol}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={styles.section}>
        <Text> </Text>
        <Text style={styles.text}>
          Total Amount: {formatCurrency(invoiceData.totalAmount)}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text>Thank you for staying with us!</Text>
      </View>
    </Page>
  </Document>
);

function OasisInvoice() {
  console.log("OasisInvoice started");
  const { bookingId } = useParams();

  const { isLoading, invoiceData } = useInvoice();
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const printRef = useRef();

  if (isLoading) return <Spinner />;
  if (!invoiceData) return <Empty resourceName="booking" />;

  console.log("OasisInvoice A1");

  //Example invoice data

  // const invoiceData = {
  //   guestName: "John Doe",
  //   checkInDate: "2024-08-01",
  //   checkOutDate: "2024-08-05",
  //   items: [
  //     { description: "Room Charge", quantity: 4, unitPrice: 100, amount: 400 },
  //     { description: "Breakfast", quantity: 4, unitPrice: 15, amount: 60 },
  //     { description: "Spa Service", quantity: 1, unitPrice: 50, amount: 50 },
  //   ],
  //   totalAmount: 510,
  // };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const generatePDFBase64 = async () => {
    const blob = await pdf(
      <OasisInvoiceTemplate invoiceData={invoiceData} />
    ).toBlob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Get Base64 without prefix
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendInvoiceEmail = async () => {
    setIsBtnDisabled(true);
    const pdfBase64 = await generatePDFBase64();

    const { guestName, guestEmail, checkInDate, checkOutDate, totalAmount } =
      invoiceData;
    const issueDate = checkOutDate.substring(0, 10);

    const templateParams = {
      guestName,
      checkInDate,
      checkOutDate,
      issueDate,
      totalAmount: formatCurrency(totalAmount),
      to_email: guestEmail,
      content: pdfBase64, // The Base64 encoded PDF
    };

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICEID;
    const templateID = "InvoiceforStayAtOasis";
    const emailJSPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    console.log("emailjs", serviceID, emailJSPublicKey);

    emailjs.send(serviceID, templateID, templateParams, emailJSPublicKey).then(
      (response) => {
        toast.success("Email sent successfully!");
        console.log("SUCCESS!", response.status, response.text);
        setIsBtnDisabled(false);
      },
      (error) => {
        toast.error("Failed to send email!");
        console.log("FAILED...", error);
        setIsBtnDisabled(false);
      }
    );

    // await emailjs.sendForm(
    //   serviceID,
    //   templateID,
    //   templateParams,
    //   emailJSPublicKey
    // );

    //   console.log("Email sent successfully!");
    // } catch (error) {
    //   console.error("Failed to send email:", error);
    // }
  };

  console.log("OasisInvoice A2");

  return (
    <>
      <Button
        onClick={sendInvoiceEmail}
        style={styles.sendEmailbutton}
        disabled={isBtnDisabled}
      >
        Send email to {invoiceData.guestEmail}
      </Button>
      <PDFViewer width="100%" height="980">
        <OasisInvoiceTemplate invoiceData={invoiceData} />
      </PDFViewer>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </>
  );

  // return (
  //   <div>
  //     {/* Preview */}
  //     <div ref={printRef}>
  //       <OasisInvoiceTemplate invoiceData={invoiceData} />
  //     </div>

  //     <PDFDownloadLink
  //       document={<OasisInvoiceTemplate invoiceData={invoiceData} />}
  //       fileName={`oasis_invoice.pdf`}
  //       style={{
  //         textDecoration: "none",
  //         padding: "10px",
  //         color: "#fff",
  //         backgroundColor: "#007bff",
  //         border: "none",
  //         borderRadius: "4px",
  //         marginRight: "10px",
  //       }}
  //     >
  //       {({ loading }) =>
  //         loading ? "Loading document..." : "Download Invoice as PDF"
  //       }
  //     </PDFDownloadLink>

  //     {/* Print button */}
  //     <button
  //       onClick={handlePrint}
  //       style={{
  //         padding: "10px",
  //         color: "#fff",
  //         backgroundColor: "#28a745",
  //         border: "none",
  //         borderRadius: "4px",
  //       }}
  //     >
  //       Print Invoice
  //     </button>
  //   </div>
  // );
}

export default OasisInvoice;
