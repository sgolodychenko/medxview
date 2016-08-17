package spring.pg;

import org.apache.poi.xwpf.converter.pdf.PdfConverter;
import org.apache.poi.xwpf.converter.pdf.PdfOptions;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.artofsolving.jodconverter.OfficeDocumentConverter;
import org.artofsolving.jodconverter.document.DocumentFormatRegistry;
import org.artofsolving.jodconverter.office.DefaultOfficeManagerConfiguration;
import org.artofsolving.jodconverter.office.OfficeManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Date;

/**
 * Created by Serhiy_Golodychenko on 8/15/2016.
 */
@RestController
public class ConverterController {
    private static final Logger log = LoggerFactory.getLogger(ConverterController.class);
    public static final String CONVERTER_ROOT = "D:\\Projects\\Delk\\sources\\medxview\\delme\\web-service\\target\\jod-converter\\";

    @RequestMapping(path = "/test")
    public String test() {
        return new Date().toString();
    }

    @RequestMapping(method = RequestMethod.POST, path = "/convert/xdoc")
    public String convertByJod(@RequestParam("file") MultipartFile file) {
        OfficeManager officeManager = new DefaultOfficeManagerConfiguration().buildOfficeManager();
        OfficeDocumentConverter converter = new OfficeDocumentConverter(officeManager);
        DocumentFormatRegistry formatRegistry = converter.getFormatRegistry();

        officeManager.start();

        String retBody;
        if (!file.isEmpty()) {
            try {
                String outFileName = CONVERTER_ROOT + file.getOriginalFilename().split("[.]")[0];
                File outputFile = new File(outFileName + ".pdf");
                outputFile.getParentFile().mkdirs();
                FileWriter writer = new FileWriter(outputFile);
                writer.close();

                FileOutputStream fos = new FileOutputStream(outFileName + ".docx");
                fos.write(file.getBytes());
                fos.close();
                File inputFile = new File(file.getName());

                converter.convert(inputFile, outputFile);
                retBody = "Converted file: " + file.getOriginalFilename();
            } catch (IOException |RuntimeException e) {
                retBody = "Failed to process: " + file.getOriginalFilename() + " => " + e.getMessage();
            }
        } else {
            retBody = "Failed to convert: " + file.getOriginalFilename() + " because it was empty";
        }
        officeManager.stop();
        return retBody;
    }

    @RequestMapping(method = RequestMethod.POST, path = "/convert/doc")
    public String convertByXdoc(@RequestParam("file") MultipartFile file) {
        String retBody;
        try
        {
            String outFileName = CONVERTER_ROOT + file.getOriginalFilename().split("[.]")[0];

            FileOutputStream fos = new FileOutputStream(outFileName + ".doc");
            fos.write(file.getBytes());
            fos.close();
            File inputFile = new File(file.getName());

            XWPFDocument document = new XWPFDocument(new FileInputStream(inputFile));


            File outFile = new File( outFileName + ".pdf" );
            outFile.getParentFile().mkdirs();

            OutputStream out = new FileOutputStream( outFile );
            PdfOptions options = PdfOptions.create().fontEncoding( "windows-1250" );
            PdfConverter.getInstance().convert( document, out, options );
            retBody = "Converted file: " + outFile.getName();
        }
        catch ( Throwable e )
        {
            retBody = "Error while converting file: " + file.getName() + "/n" + e.getMessage();
            e.printStackTrace();
        }

        return retBody;
    }
}
