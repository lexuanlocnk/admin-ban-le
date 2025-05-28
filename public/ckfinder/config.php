<?php

/*
* CKFinder Configuration File
*
* For the official documentation visit https://ckeditor.com/docs/ckfinder/ckfinder3-php/
*/

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/debugging.html

// Production
error_reporting( E_ALL & ~E_DEPRECATED & ~E_STRICT );
ini_set( 'display_errors', 0 );

// Development
// error_reporting( E_ALL );
// ini_set( 'display_errors', 1 );

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html

$config = array();

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_authentication

$config[ 'authentication' ] = function () {
    return true;
}
;

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_licenseKey

$config[ 'licenseName' ] = 'admin.chinhnhan.com';
$config[ 'licenseKey' ]  = 'J2222RNJHWRHDJCEK6DFA81HHKMBK';

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_privateDir

$config[ 'privateDir' ] = array(
    'backend' => 'default',
    'tags'   => '.ckfinder/tags',
    'logs'   => '.ckfinder/logs',
    'cache'  => '.ckfinder/cache',
    'thumbs' => '.ckfinder/cache/thumbs',
);

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_images

$config[ 'images' ] = array(
    'maxWidth'  => 1600,
    'maxHeight' => 1200,
    'quality'   => 80,
    'sizes' => array(
        'small'  => array( 'width' => 480, 'height' => 320, 'quality' => 80 ),
        'medium' => array( 'width' => 600, 'height' => 480, 'quality' => 80 ),
        'large'  => array( 'width' => 800, 'height' => 600, 'quality' => 80 )
    )
);

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_backends

$config[ 'backends' ][] = array(
    'name'         => 'default',
    'adapter'      => 'local',
    'baseUrl'      => 'https://admin.chinhnhan.com/ckfinder/userfiles/',
    // 'root'         => public_path( '/ckfinder/userfile/' ),
    'chmodFiles'   => 0777,
    'chmodFolders' => 0755,
    'filesystemEncoding' => 'UTF-8',
);

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_resourceTypes

$config[ 'defaultResourceTypes' ] = '';

$config[ 'resourceTypes' ][] = array(
    'name'              => 'Files', // Single quotes not allowed.
    'directory'         => 'files',
    'maxSize'           => 0,
    'allowedExtensions' => '7z,aiff,asf,avi,bmp,csv,doc,docx,fla,flv,gif,gz,gzip,jpeg,jpg,mid,mov,mp3,mp4,mpc,mpeg,mpg,ods,odt,pdf,png,ppt,pptx,qt,ram,rar,rm,rmi,rmvb,rtf,sdc,swf,sxc,sxw,tar,tgz,tif,tiff,txt,vsd,wav,wma,wmv,xls,xlsx,zip',
    'deniedExtensions'  => '',
    'backend'           => 'default'
);

$config[ 'resourceTypes' ][] = array(
    'name'              => 'Images',
    'directory'         => 'images',
    'maxSize'           => 0,
    'allowedExtensions' => 'bmp,gif,jpeg,jpg,png',
    'deniedExtensions'  => '',
    'backend'           => 'default'
);

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_roleSessionVar

$config[ 'roleSessionVar' ] = 'CKFinder_UserRole';

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_accessControl
$config[ 'accessControl' ][] = array(
    'role'                => '*',
    'resourceType'        => '*',
    'folder'              => '/',

    'FOLDER_VIEW'         => true,
    'FOLDER_CREATE'       => true,
    'FOLDER_RENAME'       => true,
    'FOLDER_DELETE'       => true,

    'FILE_VIEW'           => true,
    'FILE_CREATE'         => true,
    'FILE_RENAME'         => true,
    'FILE_DELETE'         => true,

    'IMAGE_RESIZE'        => true,
    'IMAGE_RESIZE_CUSTOM' => true
);

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html

$config[ 'overwriteOnUpload' ] = false;
$config[ 'checkDoubleExtension' ] = true;
$config[ 'disallowUnsafeCharacters' ] = false;
$config[ 'secureImageUploads' ] = true;
$config[ 'checkSizeAfterScaling' ] = true;
$config[ 'htmlExtensions' ] = array( 'html', 'htm', 'xml', 'js' );
$config[ 'hideFolders' ] = array( '.*', 'CVS', '__thumbs' );
$config[ 'hideFiles' ] = array( '.*' );
$config[ 'forceAscii' ] = false;
$config[ 'xSendfile' ] = false;

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_debug
$config[ 'debug' ] = false;

$config[ 'pluginsDirectory' ] = __DIR__ . '/plugins';
$config[ 'plugins' ] = array();

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_cache

$config[ 'cache' ] = array(
    'imagePreview' => 24 * 3600,
    'thumbnails'   => 24 * 3600 * 365,
    'proxyCommand' => 0
);

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_tempDirectory

$config[ 'tempDirectory' ] = sys_get_temp_dir();

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_sessionWriteClose

$config[ 'sessionWriteClose' ] = true;

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_csrfProtection

$config[ 'csrfProtection' ] = true;

// https://ckeditor.com/docs/ckfinder/ckfinder3-php/configuration.html#configuration_options_headers

$config[ 'headers' ] = array(
    'Access-Control-Allow-Origin' => '*',
    'Access-Control-Allow-Credentials' => 'true'
);

// Config must be returned - do not change it.
return $config;
