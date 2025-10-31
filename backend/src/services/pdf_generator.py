import io
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
import base64
from io import BytesIO

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.custom_styles = self._create_custom_styles()
        
    def _create_custom_styles(self):
        """Create custom styles for the PDF report"""
        styles = {}
        
        # Title style
        styles['Title'] = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1,  # Center alignment
            textColor=colors.HexColor("#1e40af")
        )
        
        # Subtitle style
        styles['Subtitle'] = ParagraphStyle(
            'CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=18,
            spaceAfter=20,
            textColor=colors.HexColor("#3b82f6")
        )
        
        # Section header style
        styles['SectionHeader'] = ParagraphStyle(
            'SectionHeader',
            parent=self.styles['Heading3'],
            fontSize=16,
            spaceAfter=15,
            textColor=colors.HexColor("#1e3a8a")
        )
        
        # Normal text style
        styles['Normal'] = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=12
        )
        
        # Small text style
        styles['Small'] = ParagraphStyle(
            'CustomSmall',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=8
        )
        
        # Bold text style
        styles['Bold'] = ParagraphStyle(
            'CustomBold',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=12,
            fontName='Helvetica-Bold'
        )
        
        return styles
    
    def generate_heart_disease_report(self, prediction_data):
        """
        Generate a comprehensive heart disease prediction report in PDF format
        
        Args:
            prediction_data (dict): Prediction result data
            
        Returns:
            bytes: PDF file as bytes
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        
        # Add header
        story.extend(self._create_header())
        
        # Add patient information
        story.extend(self._create_patient_info(prediction_data))
        
        # Add prediction results
        story.extend(self._create_prediction_results(prediction_data))
        
        # Add feature importance analysis
        story.extend(self._create_feature_importance(prediction_data))
        
        # Add medical insights
        story.extend(self._create_medical_insights(prediction_data))
        
        # Add technical information
        story.extend(self._create_technical_info())
        
        # Add disclaimer
        story.extend(self._create_disclaimer())
        
        # Add footer
        story.extend(self._create_footer())
        
        # Build the PDF
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes
    
    def _create_header(self):
        """Create the report header"""
        story = []
        
        # Title
        title = Paragraph("AI-Powered Medical Prediction Report", self.custom_styles['Title'])
        story.append(title)
        
        # Subtitle
        subtitle = Paragraph("Heart Disease Risk Assessment", self.custom_styles['Subtitle'])
        story.append(subtitle)
        
        # Date
        date_text = f"Report Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        date_para = Paragraph(date_text, self.custom_styles['Normal'])
        story.append(date_para)
        
        # Separator
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("─" * 80, self.custom_styles['Small']))
        story.append(Spacer(1, 0.2*inch))
        
        return story
    
    def _create_patient_info(self, prediction_data):
        """Create patient information section"""
        story = []
        
        # Section header
        header = Paragraph("Patient & Test Information", self.custom_styles['SectionHeader'])
        story.append(header)
        
        # Patient info table
        patient_data = [
            ["Patient Name:", "Anonymous Patient"],
            ["Age:", f"{prediction_data.get('input_data', {}).get('age', 'N/A')} years"],
            ["Gender:", "Male" if prediction_data.get('input_data', {}).get('sex', 1) == 1 else "Female"],
            ["Test Date:", datetime.now().strftime('%B %d, %Y')],
            ["Model Used:", "XGBoost Heart Disease Prediction Model"],
            ["Reference:", "Automated AI Analysis"]
        ]
        
        table = Table(patient_data, colWidths=[2*inch, 4*inch])
        table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#e5e7eb")),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f9fafb")),
            ('BACKGROUND', (1, 0), (1, -1), colors.HexColor("#ffffff")),
        ]))
        
        story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        return story
    
    def _create_prediction_results(self, prediction_data):
        """Create prediction results section"""
        story = []
        
        # Section header
        header = Paragraph("Prediction Results", self.custom_styles['SectionHeader'])
        story.append(header)
        
        # Risk assessment
        risk_level = prediction_data.get('risk_level', 'Unknown')
        probability = prediction_data.get('probability', 0)
        
        risk_colors = {
            'High': colors.red,
            'Medium': colors.orange,
            'Low': colors.green
        }
        
        risk_color = risk_colors.get(risk_level, colors.black)
        
        # Results table
        results_data = [
            ["Predicted Condition:", "Heart Disease"],
            ["Risk Level:", f"{risk_level} Risk"],
            ["Probability:", f"{probability*100:.1f}%"],
            ["Confidence:", prediction_data.get('confidence', 'N/A')]
        ]
        
        table = Table(results_data, colWidths=[2.5*inch, 3.5*inch])
        table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#e5e7eb")),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f9fafb")),
            ('BACKGROUND', (1, 2), (1, 2), colors.HexColor("#dbeafe")),  # Highlight probability
        ]))
        
        story.append(table)
        
        # Risk visualization (text-based)
        story.append(Spacer(1, 0.2*inch))
        risk_visual = Paragraph(
            f"<b>Risk Visualization:</b> [{'█' * int(probability*10)}{'░' * (10-int(probability*10))}] {probability*100:.1f}%",
            self.custom_styles['Normal']
        )
        story.append(risk_visual)
        
        story.append(Spacer(1, 0.3*inch))
        return story
    
    def _create_feature_importance(self, prediction_data):
        """Create feature importance analysis section"""
        story = []
        
        # Section header
        header = Paragraph("Feature Importance Analysis", self.custom_styles['SectionHeader'])
        story.append(header)
        
        # Explanation
        explanation = Paragraph(
            "The following factors were most influential in determining your heart disease risk:",
            self.custom_styles['Normal']
        )
        story.append(explanation)
        story.append(Spacer(1, 0.1*inch))
        
        # Feature importance table
        feature_importance = prediction_data.get('feature_importance', {})
        sorted_features = sorted(feature_importance.items(), key=lambda x: abs(x[1]), reverse=True)
        
        # Limit to top 10 features
        top_features = sorted_features[:10]
        
        # Create table data
        table_data = [["Feature", "Importance", "Impact"]]
        for feature, importance in top_features:
            impact = "Positive" if importance > 0 else "Negative"
            table_data.append([feature, f"{importance:.3f}", impact])
        
        table = Table(table_data, colWidths=[3*inch, 1.5*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#e5e7eb")),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3b82f6")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ]))
        
        story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        return story
    
    def _create_medical_insights(self, prediction_data):
        """Create medical insights section"""
        story = []
        
        # Section header
        header = Paragraph("Medical Insights", self.custom_styles['SectionHeader'])
        story.append(header)
        
        # Model findings
        findings = Paragraph(
            "<b>Model Findings:</b> Based on the analysis of your medical data, the AI model has identified "
            "several key factors that contribute to your heart disease risk assessment.",
            self.custom_styles['Normal']
        )
        story.append(findings)
        
        # Risk factors
        risk_factors = Paragraph(
            "<b>Potential Risk Factors:</b> The model indicates that certain factors in your medical profile "
            "may contribute to an increased or decreased risk of heart disease.",
            self.custom_styles['Normal']
        )
        story.append(risk_factors)
        
        # Recommendations
        recommendations_header = Paragraph(
            "<b>Recommended Next Steps:</b>",
            self.custom_styles['Bold']
        )
        story.append(recommendations_header)
        
        # Add recommendations as bullet points
        recommendations = prediction_data.get('recommendations', [])
        for rec in recommendations[:5]:  # Limit to 5 recommendations
            rec_para = Paragraph(f"• {rec}", self.custom_styles['Normal'])
            story.append(rec_para)
        
        story.append(Spacer(1, 0.3*inch))
        return story
    
    def _create_technical_info(self):
        """Create technical information section"""
        story = []
        
        # Section header
        header = Paragraph("Technical & AI Information", self.custom_styles['SectionHeader'])
        story.append(header)
        
        # Technical details
        tech_data = [
            ["Model Name:", "XGBoost Classifier v1.7.6"],
            ["Dataset:", "Cleveland Heart Disease Dataset"],
            ["Model Accuracy:", "90.2%"],
            ["Features Analyzed:", "13 medical parameters"],
            ["Processing Time:", f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"]
        ]
        
        table = Table(tech_data, colWidths=[2.5*inch, 3.5*inch])
        table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#e5e7eb")),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f9fafb")),
        ]))
        
        story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        return story
    
    def _create_disclaimer(self):
        """Create disclaimer section"""
        story = []
        
        # Section header
        header = Paragraph("Important Disclaimer", self.custom_styles['SectionHeader'])
        story.append(header)
        
        # Disclaimer text
        disclaimer = Paragraph(
            "This prediction is based on a machine learning model and should not be used as a substitute "
            "for professional medical advice. Always consult with a qualified healthcare provider for "
            "accurate diagnosis and treatment recommendations. This tool is designed for educational "
            "and informational purposes only.",
            self.custom_styles['Normal']
        )
        story.append(disclaimer)
        
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("─" * 80, self.custom_styles['Small']))
        story.append(Spacer(1, 0.2*inch))
        
        return story
    
    def _create_footer(self):
        """Create footer section"""
        story = []
        
        # Signature
        signature = Paragraph("Signature: PAMIDI ROHIT", self.custom_styles['Bold'])
        story.append(signature)
        
        # Contact info
        contact = Paragraph("AI Health Diagnostics System", self.custom_styles['Small'])
        story.append(contact)
        
        # Timestamp
        timestamp = Paragraph(f"Report ID: {datetime.now().strftime('%Y%m%d%H%M%S')}", self.custom_styles['Small'])
        story.append(timestamp)
        
        return story