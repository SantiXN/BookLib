package service

import (
	"errors"
	"github.com/google/uuid"
	"io"
	"os"
	"path/filepath"
	"strings"
)

var supportedFormats = map[string]string{
	"application/pdf": ".pdf",
	"image/jpeg":      ".jpg",
	"image/png":       ".png",
	"image/webp":      ".webp",
}

var (
	ErrUnsupportedFormat = errors.New("unsupported format")
	ErrFailedToSaveFile  = errors.New("failed to save file")
)

type FileService interface {
	UploadFile(contentType string, content io.Reader) (string, error)
}

type fileService struct {
	uploadDir string
	fileDir   string
}

func NewFileService(uploadDir string, fileDir string) FileService {
	return &fileService{
		uploadDir: uploadDir,
		fileDir:   fileDir,
	}
}

func (f fileService) UploadFile(contentType string, content io.Reader) (string, error) {
	extension, err := GetExtensionByContentType(contentType)
	if err != nil {
		return "", err
	}
	uniqueFileName := uuid.New().String()
	savePath := filepath.Join(f.uploadDir, uniqueFileName+extension)
	savePathUrl := filepath.Join(f.fileDir, uniqueFileName+extension)

	file, err := os.Create(savePath)
	if err != nil {
		return "", ErrFailedToSaveFile
	}
	defer file.Close()

	_, err = io.Copy(file, content)
	if err != nil {
		return "", ErrFailedToSaveFile
	}

	return savePathUrl, err
}

func GetExtensionByContentType(contentType string) (string, error) {
	contentType = strings.ToLower(contentType)

	ext, exists := supportedFormats[contentType]
	if !exists {
		return "", ErrUnsupportedFormat
	}

	return ext, nil
}
