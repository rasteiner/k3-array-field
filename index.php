<?php

use Kirby\Cms\App as Kirby;
use Kirby\Data\Data;
use Kirby\Form\Form;

// array field is like structure field, but each entry is a single field

Kirby::plugin('rasteriner/k3-array-field', [
    'fields' => [
        'array' => [
            'props' => [
                'field' => function (array $field) {
                    return $field;
                },
            ],
            'computed' => [
                'value' => function () {
                    return $this->rows($this->value);
                },
                'field' => function() {
                    if(empty($this->field) === true) {
                        throw new Exception('Please provide a field definition to be repeated.');
                    }

                    return $this->form()->fields()->toArray()['value'];
                }
            ],
            'methods' => [
                'rows' => function ($value) {
                    $rows = Data::decode($value, 'yaml');
                    $value = [];

                    foreach ($value as $row) {
                        $value[] = $this->form($row)->values()['value'];
                    }

                    return $rows;
                },
                'form' => function($value = null) {
                    return new Form([
                        'fields' => ['value' => $this->attrs['field']],
                        'values' => ['value' => $value],
                        'model' => $this->model(),
                    ]);
                }
            ],
            'save' => function ($value) {
                $data = [];

                foreach ($value as $row) {
                    $data[] = $this->form($row)->content()['value'];
                }

                return $data;
            },

        ]
    ]
]);
