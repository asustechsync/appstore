# Límites distritales

`limites-distritales.json` se generó desde la capa `DISTRITO.gpkg` descargada
del Portal de Infraestructura de Datos Espaciales del INEI, indicada por el
portal como “Distrital (Actualizado al 2023)”.

La geometría original usa EPSG:4326 y fue simplificada a una tolerancia
aproximada de 12 metros para reducir el peso servido por la aplicación. El
archivo resultante conserva el código UBIGEO, distrito, provincia,
departamento, caja geográfica y multipolígono.

Para regenerarlo:

```powershell
python scripts/convertir-limites-inei.py DISTRITO.gpkg apps/web/public/datos/ubigeos/limites-distritales.json
```

## Diferencias conocidas

La capa geográfica contiene 1,890 distritos. El catálogo local contiene 1,892.
No hay polígono en esta edición para `150144` (Santa María de Huachipa),
`160109` (Putumayo) ni `160114` (Teniente Manuel Clavero); la capa además trae
`180107` (San Antonio), ausente en el catálogo local. La detección automática
usa la geometría del INEI y la selección manual mantiene el catálogo local.
